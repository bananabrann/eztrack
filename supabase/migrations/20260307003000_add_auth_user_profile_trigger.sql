begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

-- Auto-create public.accounts profile rows for new auth.users signups.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_role public.user_role;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(trim(new.email), ''),
    'User'
  );

  v_role := case
    when upper(coalesce(new.raw_user_meta_data ->> 'role', '')) = 'FOREMAN'
      then 'FOREMAN'::public.user_role
    else 'CREW'::public.user_role
  end;

  insert into public.accounts (id, email, name, role)
  values (new.id, coalesce(new.email, ''), v_name, v_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

commit;
