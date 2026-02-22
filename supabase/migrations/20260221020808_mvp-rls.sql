-- MVP RLS policies
-- Roles in accounts.role: 'FOREMAN' | 'CREW'
-- accounts.id == auth.users.id
--
-- tools: public read, FOREMAN CRUD
-- projects: FOREMAN only
-- tool_management: FOREMAN read only
--                  authenticated checkout(INSERT)/return(UPDATE)
-- materials + material_usage: FOREMAN only

-- ==================
-- Users can see/edit their account row (profile)
-- ==================
alter table public.accounts enable row level security;

drop policy if exists "Users can view own account" on public.accounts;
create policy "Users can view own account"
on public.accounts
as permissive
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert own account" on public.accounts;
create policy "Users can insert own account"
on public.accounts
as permissive
for INSERT
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own account" on public.accounts;
create policy "Users can update own account"
on public.accounts
as permissive
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ==================
-- Projects: FOREMAN actions only
-- ==================

alter table public.projects enable row level security;

drop policy if exists "FOREMAN can view projects" on public.projects;
create policy "FOREMAN can view projects"
on public.projects
as permissive
for select
to authenticated
using(
  -- is this a FOREMAN?
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = "FOREMAN"
  )
);

drop policy if exists "FOREMAN can insert project" on public.projects;
create policy "FOREMAN can insert project"
on public.projects
as permissive
for insert
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = "FOREMAN"
  )
);

drop policy if exists "FOREMAN can update project" on public.projects;
create policy "FOREMAN can update project"
on public.projects
as permissive
for update
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = "FOREMAN"
  )
)
with check(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = "FOREMAN"
  )
);

drop policy if exists "FOREMAN can delete project" on public.projects;
create policy "FOREMAN can delete project"
on public.projects
as permissive
for delete
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = "FOREMAN"
  )
);
