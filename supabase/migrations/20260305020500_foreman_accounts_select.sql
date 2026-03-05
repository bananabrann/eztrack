-- Allow foreman users to read account rows so tool attribution can display names.
drop policy if exists "FOREMAN can view accounts" on public.accounts;
create policy "FOREMAN can view accounts"
on public.accounts
as permissive
for select
to authenticated
using (public.is_foreman());
