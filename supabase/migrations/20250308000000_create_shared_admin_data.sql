-- Apply this migration in the Supabase SQL Editor, or through the Supabase CLI migration workflow.
-- It creates the shared admin data tables and enables per-user Row Level Security.
-- No secrets or service-role credentials are required to apply this SQL.

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in date not null,
  check_out date not null,
  passenger text not null,
  guests integer not null,
  platform text not null,
  phone text not null default '',
  total numeric(12, 2) not null,
  paid numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_dates_check check (check_out > check_in),
  constraint reservations_guests_check check (guests >= 1),
  constraint reservations_platform_check check (platform in ('particular', 'booking', 'airbnb')),
  constraint reservations_total_check check (total > 0),
  constraint reservations_paid_check check (paid >= 0 and paid <= total)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  kind text not null,
  category text not null,
  description text not null default '',
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expenses_kind_category_check check (
    (kind = 'variable' and category in ('alquiler', 'luz', 'agua', 'limpieza', 'blancos', 'booking_commission', 'varios', 'flow', 'gas'))
    or (kind = 'extraordinary' and category = 'extraordinary')
  ),
  constraint expenses_amount_check check (amount > 0)
);

create index if not exists reservations_user_check_in_idx
  on public.reservations (user_id, check_in);

create index if not exists reservations_user_check_out_idx
  on public.reservations (user_id, check_out);

create index if not exists expenses_user_date_idx
  on public.expenses (user_id, date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

alter table public.reservations enable row level security;
alter table public.expenses enable row level security;

create policy "Authenticated users can select their own reservations"
  on public.reservations for select to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can insert their own reservations"
  on public.reservations for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated users can update their own reservations"
  on public.reservations for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own reservations"
  on public.reservations for delete to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can select their own expenses"
  on public.expenses for select to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can insert their own expenses"
  on public.expenses for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated users can update their own expenses"
  on public.expenses for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own expenses"
  on public.expenses for delete to authenticated
  using (auth.uid() = user_id);
