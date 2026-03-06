begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

drop policy if exists "FOREMAN can view accounts" on public.accounts;

create or replace function public.is_foreman()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.accounts a
    where a.id = auth.uid()
      and a.role = 'FOREMAN'
  );
$$;

revoke all on function public.is_foreman() from public;
grant execute on function public.is_foreman() to authenticated;

create policy "FOREMAN can view accounts"
on public.accounts
as permissive
for select
to authenticated
using (public.is_foreman());

commit;
