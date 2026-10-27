create table if not exists forum_registrations (
  id bigint generated always as identity primary key,
  full_name text not null,
  phone text not null,
  company text not null,
  job_title text not null,
  created_at timestamptz not null default now()
);
