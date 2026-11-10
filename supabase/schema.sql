-- Vela early-access subscribers.
-- Run this in the Supabase SQL editor.
-- The app uses the service role key on the server. Do not add an anon or public policy.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key,
  email text not null,
  status text not null check (status in ('pending', 'confirmed', 'unsubscribed')),
  dog_size text check (dog_size is null or dog_size in ('small', 'medium', 'large')),
  dig_frequency text check (dig_frequency is null or dig_frequency in ('occasionally', 'frequently', 'daily')),
  correction_methods text[] not null default '{}',
  message_variant text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  confirm_token text not null unique,
  unsubscribe_token text not null unique,
  consent_at timestamptz not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_lower_idx
  on public.subscribers (lower(email));

create index if not exists subscribers_pending_created_idx
  on public.subscribers (created_at)
  where status = 'pending';

alter table public.subscribers enable row level security;
