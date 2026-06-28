create extension if not exists pgcrypto;

create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0 and char_length(title) <= 80),
  content text not null check (char_length(trim(content)) > 0 and char_length(content) <= 1200),
  password_hash text not null,
  created_at timestamptz not null default now(),
  position_index double precision not null default (extract(epoch from now()) * 1000)
);

alter table public.memos
add column if not exists position_index double precision not null default (extract(epoch from now()) * 1000);

update public.memos
set position_index = extract(epoch from created_at) * 1000
where position_index is null;

alter table public.memos enable row level security;

drop policy if exists "Anyone can read memos" on public.memos;
create policy "Anyone can read memos"
on public.memos
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can create memos" on public.memos;
create policy "Anyone can create memos"
on public.memos
for insert
to anon, authenticated
with check (
  char_length(trim(title)) > 0
  and char_length(title) <= 80
  and char_length(trim(content)) > 0
  and char_length(content) <= 1200
  and char_length(password_hash) > 0
);

grant usage on schema public to anon, authenticated, service_role;
grant select, insert on table public.memos to anon, authenticated;
grant select, insert, update, delete on table public.memos to service_role;
