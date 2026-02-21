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
-- Users can see/edit their account row
-- ==================
alter table public.accounts enable row level security

drop policy if exists "Users can view own account" on public.accounts;
create policy "Users can view own account"
on public.accounts
as permissive
for select
to authenticated
using (id = auth.uid())

drop policy if exists "Users can insert data to own account" on public.accounts;
create policy "Users can update own account"
on public.accounts
as permissive
for INSERT
to authenticated
with check (id = auth.uid())

drop policy if exists "Users can update own account" on public.accounts;
create policy "Users can update own account"
on public.accounts
as permissive
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid())