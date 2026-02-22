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
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
);

drop policy if exists "FOREMAN can insert project" on public.projects;
create policy "FOREMAN can insert project"
on public.projects
as permissive
for insert
to authenticated
with check(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
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
      and account.role = 'FOREMAN'
  )
)
with check(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
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
      and account.role = 'FOREMAN'
  )
);

-- ==================
-- Tools: public read / FOREMAN CRUD
-- ==================

alter table public.tools enable row level security;

drop policy if exists "Public can view tools" on public.tools;
create policy "Public can view tools"
on public.tools
as permissive
for select
to anon, authenticated
using (true);

drop policy if exists "FOREMAN can insert tool" on public.tools;
create policy "FOREMAN can insert tool"
on public.tools
as permissive
for insert
to authenticated
with check(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
);

drop policy if exists "FOREMAN can update tool" on public.tools;
create policy "FOREMAN can update tool"
on public.tools
as permissive
for update
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
)
with check(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
);

drop policy if exists "FOREMAN can delete tool" on public.tools;
create policy "FOREMAN can delete tool"
on public.tools
as permissive
for delete
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
);

-- ==================
-- Tool_Management: FOREMAN read, insert, update / CREW insert, update
-- ==================

alter table public.tool_management enable row level security;

drop policy if exists "FOREMAN can view tool_management" on public.tool_management;
create policy "FOREMAN can view tool_management"
on public.tool_management
as permissive
for select
to authenticated
using(
  exists(
    select 1
    from public.accounts account
    where account.id = auth.uid()
      and account.role = 'FOREMAN'
  )
);

drop policy if exists "USER can checkout tool" on public.tool_management;
create policy "USER can checkout tool"
on public.tool_management
as permissive
for insert
to authenticated
with check(user_id = auth.uid());

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
with check(user_id = auth.uid());


