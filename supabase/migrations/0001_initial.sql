-- Schema for Co-Op Tracker
create table workspace (
  id uuid primary key default gen_random_uuid(),
  name text,
  edit_token text unique not null
);

create table games (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspace(id) on delete cascade,
  platform text check (platform in ('steam','manual')) not null,
  app_id text,
  name text not null,
  store_url text,
  header_image text,
  is_manual boolean generated always as (platform = 'manual') stored,
  created_at timestamptz default now()
);

create table game_updates (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  source text check (source in ('steam_news','steam_store','manual','unknown')),
  title text,
  url text,
  published_at timestamptz,
  created_at timestamptz default now()
);

create table game_latest_cache (
  game_id uuid primary key references games(id) on delete cascade,
  last_update_at timestamptz,
  last_update_title text,
  last_update_url text,
  last_checked_at timestamptz,
  source text
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspace(id) on delete cascade,
  name text unique
);

create table game_tags (
  game_id uuid references games(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (game_id, tag_id)
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  body text,
  created_at timestamptz default now()
);

-- Indexes
create index games_app_platform_idx on games(app_id, platform);
create index game_updates_published_idx on game_updates(game_id, published_at desc);

-- Enable RLS
alter table workspace enable row level security;
alter table games enable row level security;
alter table game_updates enable row level security;
alter table game_latest_cache enable row level security;
alter table tags enable row level security;
alter table game_tags enable row level security;
alter table notes enable row level security;

-- Public read policies
create policy "workspace_read" on workspace for select using (true);
create policy "games_read" on games for select using (true);
create policy "game_updates_read" on game_updates for select using (true);
create policy "game_latest_cache_read" on game_latest_cache for select using (true);
create policy "tags_read" on tags for select using (true);
create policy "game_tags_read" on game_tags for select using (true);
create policy "notes_read" on notes for select using (true);
