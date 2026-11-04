-- Add destination location to monthly activity records in existing projects.
alter table public.monthly_activities
  add column if not exists to_location text not null default '';
