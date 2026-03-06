begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

-- Allow users to select all of their own tool_management rows (active + historical).
-- This avoids return-flow read issues where checked_in transitions from NULL to timestamp.
drop policy if exists "USER can view own tool_management" on public.tool_management;

create policy "USER can view own tool_management"
on public.tool_management
as permissive
for select
to authenticated
using (user_id = auth.uid());

commit;
