-- Applied to hosted Supabase as subscription_payments.
-- Manual BTC / Lead Bank membership checkout.

create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('essential', 'priority', 'executive')),
  amount_usd numeric not null check (amount_usd > 0),
  method text not null check (method in ('btc', 'bank')),
  reference text not null unique,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment', 'pending_review', 'paid', 'rejected', 'cancelled')),
  payer_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscription_payments_user_id
  on public.subscription_payments (user_id);

create index if not exists idx_subscription_payments_status
  on public.subscription_payments (status);

create index if not exists idx_subscription_payments_user_status
  on public.subscription_payments (user_id, status);

comment on table public.subscription_payments is
  'Manual membership payments (Bitcoin on-chain or Lead Bank transfer). Plan is granted only after admin confirmation.';

alter table public.subscription_payments enable row level security;

create or replace function public.protect_subscription_payment()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.user_id is distinct from old.user_id
     or new.plan is distinct from old.plan
     or new.amount_usd is distinct from old.amount_usd
     or new.reference is distinct from old.reference then
    raise exception 'Payment identity fields cannot be changed.';
  end if;

  if old.status <> 'awaiting_payment' then
    raise exception 'This payment can no longer be updated.';
  end if;

  if new.status not in ('awaiting_payment', 'pending_review', 'cancelled') then
    raise exception 'Invalid payment status.';
  end if;

  if new.reviewed_by is not null or new.reviewed_at is not null then
    raise exception 'Review fields are reserved for operators.';
  end if;

  return new;
end;
$$;

drop trigger if exists subscription_payments_protect on public.subscription_payments;
create trigger subscription_payments_protect
  before update on public.subscription_payments
  for each row execute function public.protect_subscription_payment();

drop trigger if exists subscription_payments_set_updated_at on public.subscription_payments;
create trigger subscription_payments_set_updated_at
  before update on public.subscription_payments
  for each row execute function public.set_updated_at();

drop policy if exists subscription_payments_select_own on public.subscription_payments;
create policy subscription_payments_select_own
  on public.subscription_payments for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists subscription_payments_select_admin on public.subscription_payments;
create policy subscription_payments_select_admin
  on public.subscription_payments for select to authenticated
  using (public.is_admin());

drop policy if exists subscription_payments_insert_own on public.subscription_payments;
create policy subscription_payments_insert_own
  on public.subscription_payments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'awaiting_payment'
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists subscription_payments_update_own on public.subscription_payments;
create policy subscription_payments_update_own
  on public.subscription_payments for update to authenticated
  using (
    user_id = (select auth.uid())
    and status = 'awaiting_payment'
  )
  with check (
    user_id = (select auth.uid())
    and status in ('awaiting_payment', 'pending_review', 'cancelled')
  );

drop policy if exists subscription_payments_update_admin on public.subscription_payments;
create policy subscription_payments_update_admin
  on public.subscription_payments for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update on public.subscription_payments to authenticated;
