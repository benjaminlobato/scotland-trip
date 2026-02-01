# Scotland Trip Map

A shared map for planning our Scotland trip. Add pins for food spots, pubs, hikes, places to stay, and more.

## Setup

### 1. Supabase

Create a project at [supabase.com](https://supabase.com) and run this SQL in the SQL editor:

```sql
create table pins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  category text,
  added_by text,
  created_at timestamptz default now()
);
```

Then enable Row Level Security and add a policy to allow all operations (since this is a small private app):

```sql
alter table pins enable row level security;
create policy "Allow all" on pins for all using (true) with check (true);
```

### 2. Environment Variables

Copy `.env` and fill in your Supabase values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_PASSWORD=scotland2025
```

Change `VITE_APP_PASSWORD` to whatever shared password you want.

### 3. Run

```bash
npm install
npm run dev
```

## Usage

- Enter the shared password on first visit
- Click anywhere on the map to add a pin
- Click a pin to see its details
- Pins are color-coded by category: red (food), amber (pub), green (hike), blue (stay), purple (other)
