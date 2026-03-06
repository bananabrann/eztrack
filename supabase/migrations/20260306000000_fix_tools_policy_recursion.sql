begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

-- Remove any prior recursive version of this policy.
drop policy if exists "USER can update own checkedout tool status" on public.tools;

-- Validate immutable tool identity fields without recursive RLS reads.
create or replace function public.tool_identity_unchanged(
  p_tool_id uuid,
  p_name text,
  p_created_at timestamptz
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.tools t
    where t.id = p_tool_id
      and t.name = p_name
      and t.created_at = p_created_at
  );
$$;

revoke all on function public.tool_identity_unchanged(uuid, text, timestamptz) from public;
grant execute on function public.tool_identity_unchanged(uuid, text, timestamptz) to authenticated;

-- Allow active checkout holder to flip tool status during checkout/return only.
create policy "USER can update own checkedout tool status"
on public.tools
as permissive
for update
to authenticated
using (
  exists (
    select 1
    from public.tool_management tm
    where tm.tool_id = tools.id
      and tm.user_id = auth.uid()
      and tm.checked_in is null
  )
)
with check (
  status in ('AVAILABLE', 'CHECKEDOUT')
  and public.tool_identity_unchanged(id, name, created_at)
  and exists (
    select 1
    from public.tool_management tm
    where tm.tool_id = tools.id
      and tm.user_id = auth.uid()
      and tm.checked_in is null
  )
);

commit;
