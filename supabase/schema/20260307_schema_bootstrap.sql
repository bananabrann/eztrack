-- Canonical schema bootstrap for local/dev environment setup.
-- Purpose: create core enums/tables/fks/defaults to match current production model,
-- then apply versioned migrations from supabase/migrations.
-- This file is intentionally separate from migration history.

begin;
set local lock_timeout = '5s';
set local statement_timeout = '120s';

create extension if not exists pgcrypto with schema public;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'user_role'
  ) then
    create type public.user_role as enum ('FOREMAN', 'CREW');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'project_status'
  ) then
    create type public.project_status as enum ('ACTIVE', 'COMPLETED');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'tool_status'
  ) then
    create type public.tool_status as enum ('AVAILABLE', 'CHECKEDOUT', 'ARCHIVE');
  end if;
end
$$;

create table if not exists public.accounts (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  role public.user_role not null default 'CREW'::public.user_role,
  created_at timestamptz not null default now(),
  constraint accounts_pkey primary key (id)
);

create table if not exists public.projects (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_name text not null,
  start_date date not null,
  end_date date not null,
  status public.project_status not null,
  constraint projects_pkey primary key (id)
);

create table if not exists public.tools (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  status public.tool_status not null default 'AVAILABLE'::public.tool_status,
  project_id uuid not null,
  constraint tools_pkey primary key (id),
  constraint tools_project_id_fkey
    foreign key (project_id) references public.projects(id)
);

create table if not exists public.tool_management (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool_id uuid not null,
  user_id uuid not null,
  checked_out timestamptz not null default now(),
  checked_in timestamptz,
  constraint tool_management_pkey primary key (id),
  constraint tool_management_tool_id_fkey
    foreign key (tool_id) references public.tools(id),
  constraint tool_management_user_id_fkey
    foreign key (user_id) references public.accounts(id)
);

create table if not exists public.tool_management_force_return_backup (
  id uuid,
  created_at timestamptz,
  tool_id uuid,
  user_id uuid,
  checked_out timestamptz,
  checked_in timestamptz
);

create table if not exists public.materials (
  id uuid not null default gen_random_uuid(),
  name text not null,
  unit_qty smallint not null,
  unit_cost double precision not null,
  low_stock_threshold smallint not null,
  project_id uuid not null,
  constraint materials_pkey primary key (id),
  constraint materials_project_id_fkey
    foreign key (project_id) references public.projects(id)
);

create table if not exists public.material_usage (
  id uuid not null default gen_random_uuid(),
  material_id uuid not null,
  project_id uuid not null,
  quantity_used smallint not null,
  total_cost double precision not null,
  constraint material_usage_pkey primary key (id),
  constraint material_usage_materialId_fkey
    foreign key (material_id) references public.materials(id),
  constraint material_usage_projectId_fkey
    foreign key (project_id) references public.projects(id)
);

commit;
