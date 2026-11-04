alter table public.employees
  add column if not exists company_name text not null default '';

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
