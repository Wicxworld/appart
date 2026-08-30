-- Applied to hosted Supabase as search_requests_and_runs.
-- Kept in-repo so app and database stop drifting.

create type public.search_status as enum ('active', 'paused', 'matched', 'closed');

create table public.search_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  city text not null,
  budget_max numeric check (budget_max is null or budget_max >= 0),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  notes text,
  status public.search_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_search_requests_user_id on public.search_requests (user_id);
create index idx_search_requests_status on public.search_requests (status);

create table public.search_runs (
  id uuid primary key default gen_random_uuid(),
  search_request_id uuid not null references public.search_requests(id) on delete cascade,
  status text not null default 'queued',
  listings_scanned integer not null default 0,
  matches_found integer not null default 0,
  log text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_search_runs_request_id on public.search_runs (search_request_id);

alter table public.search_requests enable row level security;
alter table public.search_runs enable row level security;

create policy search_requests_select_own
  on public.search_requests for select to authenticated
  using (user_id = (select auth.uid()));

create policy search_requests_insert_own
  on public.search_requests for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy search_requests_update_own
  on public.search_requests for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy search_runs_select_own
  on public.search_runs for select to authenticated
  using (
    exists (
      select 1 from public.search_requests s
      where s.id = search_request_id
        and s.user_id = (select auth.uid())
    )
  );

create or replace function public.start_search_run()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.search_runs (search_request_id, status, log)
  values (new.id, 'queued', 'Search created. Waiting for the matching worker.');
  return new;
end;
$$;

create trigger on_search_request_created
  after insert on public.search_requests
  for each row execute function public.start_search_run();

grant select, insert, update on public.search_requests to authenticated;
grant select on public.search_runs to authenticated;
