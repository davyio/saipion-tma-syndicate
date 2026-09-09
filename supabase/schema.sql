-- ==============================================================================
-- THE SAIPION SYNDICATE: SUPABASE CORE SCHEMA
-- Monorepo Database Engine for 10-App TMA Pipeline
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Identity Matrix: Telegram Users Table
create table if not exists public.users (
    id bigint primary key, -- Telegram ID
    username text,
    first_name text not null default '',
    last_name text,
    language_code text default 'en',
    is_premium boolean default false,
    created_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now()
);

-- Index for username lookups
create index if not exists idx_users_username on public.users(username);

-- 2. Cash Register: Payments Ledger (Stars, TON, Fiat)
create table if not exists public.payments (
    id uuid primary key default uuid_generate_v4(),
    telegram_user_id bigint not null references public.users(id) on delete cascade,
    app_module text not null, -- 'star-buster', 'render-trap', 'osint-radar', etc.
    amount numeric not null,
    currency text not null default 'XTR', -- 'XTR' (Telegram Stars), 'TON', 'USD'
    telegram_payment_charge_id text unique,
    provider_payment_charge_id text,
    status text not null default 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    payload jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_payments_user on public.payments(telegram_user_id);
create index if not exists idx_payments_module on public.payments(app_module);
create index if not exists idx_payments_charge on public.payments(telegram_payment_charge_id);

-- 3. Stateless Session Recovery Matrix
create table if not exists public.app_sessions (
    id uuid primary key default uuid_generate_v4(),
    telegram_user_id bigint not null references public.users(id) on delete cascade,
    app_module text not null,
    state_payload jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now(),
    constraint unique_user_module unique (telegram_user_id, app_module)
);

create index if not exists idx_sessions_user_module on public.app_sessions(telegram_user_id, app_module);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.payments enable row level security;
alter table public.app_sessions enable row level security;

-- Policies: Backend uses service_role key to bypass RLS.
-- Public read-only policies if needed with custom anon auth can be added here.
