-- MVP RLS policies
-- Roles in accounts.role: 'FOREMAN' | 'CREW'
-- accounts.id == auth.users.id
--
-- tools: public read, FOREMAN CRUD
-- projects: FOREMAN only
-- tool_management: FOREMAN read only
--                  authenticated checkout(INSERT)/return(UPDATE)
-- materials + material_usage: FOREMAN only

-- Helper function to check FOREMAN role
create or replace function public.is_foreman()
returns boolean
language sql 
stable
as $$
  select exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  );
$$;

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
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own account" on public.accounts;
create policy "Users can update own account"
on public.accounts
as permissive
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = (
    select account.role
    from public.accounts account
    where account.id = auth.uid()
  )
);

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
using(public.is_foreman());

drop policy if exists "FOREMAN can insert project" on public.projects;
create policy "FOREMAN can insert project"
on public.projects
as permissive
for insert
to authenticated
with check(public.is_foreman());

drop policy if exists "FOREMAN can update project" on public.projects;
create policy "FOREMAN can update project"
on public.projects
as permissive
for update
to authenticated
using(public.is_foreman())
with check(public.is_foreman());

drop policy if exists "FOREMAN can delete project" on public.projects;
create policy "FOREMAN can delete project"
on public.projects
as permissive
for delete
to authenticated
using(public.is_foreman());

-- ==================
-- Tools: USERS read / FOREMAN CRUD
-- ==================

alter table public.tools enable row level security;

drop policy if exists "USERS can view tools" on public.tools;
create policy "USERS can view tools"
on public.tools
as permissive
for select
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role in ('CREW', 'FOREMAN')
  )
);

drop policy if exists "FOREMAN can insert tool" on public.tools;
create policy "FOREMAN can insert tool"
on public.tools
as permissive
for insert
to authenticated
with check(public.is_foreman());

drop policy if exists "FOREMAN can update tool" on public.tools;
create policy "FOREMAN can update tool"
on public.tools
as permissive
for update
to authenticated
using(public.is_foreman())
with check(public.is_foreman());

drop policy if exists "FOREMAN can delete tool" on public.tools;
create policy "FOREMAN can delete tool"
on public.tools
as permissive
for delete
to authenticated
using(public.is_foreman());

-- ==================
-- Tool_Management: FOREMAN read / User insert, update
-- ==================

alter table public.tool_management enable row level security;

drop policy if exists "FOREMAN can view tool_management" on public.tool_management;
create policy "FOREMAN can view tool_management"
on public.tool_management
as permissive
for select
to authenticated
using(public.is_foreman());

drop policy if exists "USER can checkout tool" on public.tool_management;
create policy "USER can checkout tool"
on public.tool_management
as permissive
for insert
to authenticated
with check(
  user_id = auth.uid()
  and checked_in is null
);

drop policy if exists "USER can return tool" on public.tool_management;
create policy "USER can return tool"
on public.tool_management
as permissive
for update
to authenticated
using(
  user_id = auth.uid()
  and checked_in is null
)
with check(
  user_id = auth.uid()
  and checked_in is not null
);

drop policy if exists "USER can view own tool_management" on public.tool_management;
create policy "USER can view own tool_management"
on pubic.tool_management
as permissive
for select
to authenticated
using(
  user_id = auth.uid()
  and checked_in is null
);

-- ==================
-- Materials: FOREMAN only
-- ==================

alter table public.materials enable row level security;

drop policy if exists "FOREMAN can view materials" on public.materials;
create policy "FOREMAN can view materials"
on public.materials
as permissive
for select
to authenticated
using(public.is_foreman());

drop policy if exists "FOREMAN can insert material" on public.materials;
create policy "FOREMAN can insert material"
on public.materials
as permissive
for insert
to authenticated
with check(public.is_foreman());

drop policy if exists "FOREMAN can update material" on public.materials;
create policy "FOREMAN can update material"
on public.materials
as permissive
for update
to authenticated
using(public.is_foreman())
with check(public.is_foreman());

drop policy if exists "FOREMAN can delete material" on public.materials;
create policy "FOREMAN can delete material"
on public.materials
as permissive
for delete
to authenticated
using(public.is_foreman());

-- ==================
-- Material_Usage: FOREMAN only (INSERT)
-- ==================

alter table public.material_usage enable row level security;

drop policy if exists "FOREMAN can view material_usage" on public.material_usage;
create policy "FOREMAN can view material_usage"
on public.material_usage
as permissive
for select
to authenticated
using(public.is_foreman());

drop policy if exists "FOREMAN can insert material_usage" on public.material_usage;
create policy "FOREMAN can insert material_usage"
on public.material_usage
as permissive
for insert
to authenticated
with check(public.is_foreman());

-- ==================
-- Indexes for performance
-- ==================

create index if not exists "get materials" on public.materials(project_id);
create index if not exists "get material-cost" on public.material_usage(project_id);
