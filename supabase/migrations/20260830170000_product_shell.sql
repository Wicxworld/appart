-- Applied to hosted Supabase as product_shell_profiles_and_admin.
-- Membership plan, notification prefs, admin search visibility.

alter table public.profiles
  add column if not exists plan text,
  add column if not exists notification_email boolean not null default true,
  add column if not exists notification_matches boolean not null default true;

alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan is null or plan in ('essential', 'priority', 'executive'));

comment on column public.profiles.plan is 'Selected membership plan slug. Stripe checkout is not required yet.';
comment on column public.profiles.notification_email is 'Email updates about the account and search.';
comment on column public.profiles.notification_matches is 'Email when a qualifying residence is found.';

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'search_requests'
      and policyname = 'search_requests_select_admin'
  ) then
    create policy search_requests_select_admin
      on public.search_requests for select to authenticated
      using (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'search_runs'
      and policyname = 'search_runs_select_admin'
  ) then
    create policy search_runs_select_admin
      on public.search_runs for select to authenticated
      using (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'listings'
      and policyname = 'listings_select_admin'
  ) then
    create policy listings_select_admin
      on public.listings for select to authenticated
      using (public.is_admin());
  end if;
end $$;

-- Role changes are blocked by protect_profile_fields unless the session is already admin.
-- Migrations run without an authenticated admin, so disable the trigger for this seed.
alter table public.profiles disable trigger profiles_protect_fields;

update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) in (
    'williamdunnagan1957@gmail.com',
    'motarabo99@gmail.com'
  );

alter table public.profiles enable trigger profiles_protect_fields;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  assigned_role public.app_role := 'tenant';
begin
  if lower(coalesce(new.email, '')) in (
    'williamdunnagan1957@gmail.com',
    'motarabo99@gmail.com'
  ) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (
    id,
    full_name,
    role
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    assigned_role
  );

  return new;
end;
$function$;
