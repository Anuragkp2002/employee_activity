-- ActivityTrack schema for the new Supabase project.
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  employee_name text not null,
  employee_id text not null unique,
  email text not null unique,
  company_name text not null default '',
  designation text not null default 'Employee',
  location text not null default 'Headquarters',
  department text not null default 'General',
  role text not null default 'employee' check (role in ('employee', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monthly_activities (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null,
  activity text not null,
  ra text not null default '',
  from_location text not null default '',
  to_location text not null default '',
  to_kilometer numeric(10,2) not null default 0,
  site_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_transfers (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null,
  activity text not null,
  from_location text not null,
  to_location text not null,
  total_kilometer numeric(10,2) not null default 0,
  cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists monthly_activities_employee_date_idx on public.monthly_activities(employee_id, date);
create index if not exists material_transfers_employee_date_idx on public.material_transfers(employee_id, date);

create or replace function public.is_activitytrack_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.employees e where e.auth_user_id = auth.uid() and e.role = 'admin' and e.is_active); $$;

create or replace function public.activitytrack_employee_id()
returns uuid language sql stable security definer set search_path = public
as $$ select e.id from public.employees e where e.auth_user_id = auth.uid() and e.is_active limit 1; $$;

revoke all on function public.is_activitytrack_admin() from public, anon;
revoke all on function public.activitytrack_employee_id() from public, anon;
grant execute on function public.is_activitytrack_admin() to authenticated;
grant execute on function public.activitytrack_employee_id() to authenticated;

-- Auth sign-up creates the matching employee profile. The first account is the initial admin.
create or replace function public.handle_activitytrack_signup()
returns trigger language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_employee_id text;
  v_role text := 'employee';
begin
  perform pg_advisory_xact_lock(hashtext('activitytrack-initial-admin'));
  v_employee_id := upper(trim(coalesce(new.raw_user_meta_data->>'employee_id', '')));
  if v_employee_id = '' then
    raise exception 'Employee ID is required to create an ActivityTrack account';
  end if;
  if not exists (select 1 from public.employees where role = 'admin') then
    v_role := 'admin';
  end if;
  insert into public.employees (auth_user_id, employee_name, employee_id, email, company_name, designation, location, department, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'employee_name'), ''), split_part(new.email, '@', 1)),
    v_employee_id,
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data->>'company_name'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data->>'designation'), ''), 'Employee'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'location'), ''), 'Headquarters'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'department'), ''), 'General'),
    v_role
  );
  return new;
end;
$$;

drop trigger if exists on_activitytrack_auth_user_created on auth.users;
revoke all on function public.handle_activitytrack_signup() from public, anon, authenticated;
create trigger on_activitytrack_auth_user_created
after insert on auth.users
for each row execute function public.handle_activitytrack_signup();

alter table public.employees enable row level security;
alter table public.monthly_activities enable row level security;
alter table public.material_transfers enable row level security;

drop policy if exists employees_select_self_or_admin on public.employees;
create policy employees_select_self_or_admin on public.employees for select to authenticated
using (auth_user_id = auth.uid() or (select public.is_activitytrack_admin()));
drop policy if exists employees_update_admin on public.employees;
create policy employees_update_admin on public.employees for update to authenticated
using ((select public.is_activitytrack_admin())) with check ((select public.is_activitytrack_admin()));
drop policy if exists employees_delete_admin on public.employees;
create policy employees_delete_admin on public.employees for delete to authenticated
using ((select public.is_activitytrack_admin()));

drop policy if exists activities_select_owner_admin on public.monthly_activities;
create policy activities_select_owner_admin on public.monthly_activities for select to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists activities_insert_owner_admin on public.monthly_activities;
create policy activities_insert_owner_admin on public.monthly_activities for insert to authenticated
with check (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists activities_update_owner_admin on public.monthly_activities;
create policy activities_update_owner_admin on public.monthly_activities for update to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()))
with check (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists activities_delete_owner_admin on public.monthly_activities;
create policy activities_delete_owner_admin on public.monthly_activities for delete to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));

drop policy if exists transfers_select_owner_admin on public.material_transfers;
create policy transfers_select_owner_admin on public.material_transfers for select to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists transfers_insert_owner_admin on public.material_transfers;
create policy transfers_insert_owner_admin on public.material_transfers for insert to authenticated
with check (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists transfers_update_owner_admin on public.material_transfers;
create policy transfers_update_owner_admin on public.material_transfers for update to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()))
with check (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));
drop policy if exists transfers_delete_owner_admin on public.material_transfers;
create policy transfers_delete_owner_admin on public.material_transfers for delete to authenticated
using (employee_id = (select public.activitytrack_employee_id()) or (select public.is_activitytrack_admin()));

revoke all on public.employees, public.monthly_activities, public.material_transfers from anon, authenticated;
grant select, update, delete on public.employees to authenticated;
grant select, insert, update, delete on public.monthly_activities, public.material_transfers to authenticated;
