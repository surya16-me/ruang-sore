-- ============================================================
-- RuangSore — Database Schema
-- Jalankan di Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Table: conversations
-- Setiap user punya banyak percakapan
create table if not exists conversations (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  title      text        not null default 'Percakapan baru',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Table: messages
-- Pesan dalam setiap percakapan
create table if not exists messages (
  id              uuid        default gen_random_uuid() primary key,
  conversation_id uuid        references conversations(id) on delete cascade not null,
  role            text        not null check (role in ('user', 'assistant')),
  content         text        not null,
  created_at      timestamptz default now() not null
);

-- Index untuk performa query
create index if not exists messages_conversation_id_idx on messages(conversation_id);
create index if not exists conversations_user_id_idx   on conversations(user_id);

-- Auto-update updated_at saat ada pesan baru
create or replace function update_conversation_timestamp()
returns trigger language plpgsql as $$
begin
  update conversations
    set updated_at = now()
    where id = new.conversation_id;
  return new;
end;
$$;

create or replace trigger messages_update_conversation
  after insert on messages
  for each row execute function update_conversation_timestamp();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table conversations enable row level security;
alter table messages      enable row level security;

-- Users hanya bisa lihat/ubah/hapus conversation milik sendiri
create policy "users_own_conversations"
  on conversations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users hanya bisa akses messages di conversation milik sendiri
create policy "users_own_messages"
  on messages for all
  using (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  )
  with check (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  );
