create table if not exists forum_registrations (
  id bigint generated always as identity primary key,
  full_name text not null,
  phone text not null,
  company text not null,
  job_title text not null,
  created_at timestamptz not null default now()
);

-- One registration per phone number, compared on its last 9 digits so
-- 0712 345 678, 712345678 and +254 712 345 678 count as the same person.
alter table forum_registrations add column if not exists phone_key text;
update forum_registrations set phone_key = right(regexp_replace(phone, '\D', '', 'g'), 9) where phone_key is null;
create unique index if not exists forum_registrations_phone_key on forum_registrations (phone_key);
