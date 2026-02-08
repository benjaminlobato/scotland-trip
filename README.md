# Scotland Trip Map

An interactive collaborative map for planning a Scotland trip. Features multiple data layers including landmarks, restaurants, hiking trails, train routes, bird sightings, heritage audio recordings, YouTube travel videos, castles, and regional climate data.

**Live site**: Hosted on Vercel (password protected)

## Features

- **Collaborative pins** - Add and share places with trip companions (Supabase backend)
- **10+ toggleable map layers** - Landmarks, trails, trains, food, videos, castles, birds, climate, etc.
- **Mobile-friendly** - Responsive design with touch-optimized controls
- **Password protected** - Simple shared password for privacy

## Tech Stack

- **Frontend**: React + Vite
- **Mapping**: Leaflet / react-leaflet
- **Database**: Supabase (for collaborative pins)
- **Hosting**: Vercel
- **APIs**: eBird, OpenStreetMap Overpass, Wikipedia, YouTube embeds

## Setup

### 1. Supabase

Create a project at [supabase.com](https://supabase.com) and run this SQL:

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

alter table pins enable row level security;
create policy "Allow all" on pins for all using (true) with check (true);
```

### 2. Environment Variables

Create a `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_PASSWORD=your-shared-password
VITE_EBIRD_API_KEY=your-ebird-api-key  # Optional, for bird sightings
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

The repo is connected to Vercel for auto-deploy on push. Environment variables must be set in Vercel dashboard → Project Settings → Environment Variables.

## Map Layers

| Layer | Icon | Description |
|-------|------|-------------|
| User Pins | Colored dots | Collaborative pins (food, pub, hike, stay, other) |
| Landmarks | 🔴 | Atlas Obscura curated places |
| Trails | Green lines | Waymarked Trails hiking overlay |
| Castles | 🏰 | OpenStreetMap castles with Wikipedia images |
| Trains | 🚂 | OpenRailwayMap lines + stations |
| Food | 🍽️ | Curated restaurants along trip route |
| Videos | ▶️ | YouTube travel videos with embedded players |
| Audio | 🎙️ | Heritage recordings (Tobar an Dualchais) |
| Birds | 🐦 | Recent eBird sightings with calls |
| Dogs | 🐕 | Dog-friendly locations |
| Stays | 🏨 | Hotels, hostels, B&Bs from OpenStreetMap |
| Climate | 🌡️ | October averages by region (temp, rain %, daylight) |

## Usage

1. Enter the shared password
2. Toggle layers using the "Layers" panel (bottom-left)
3. Click "📍" to enter pin creation mode, then click map to add
4. Click any marker to see details/popup
5. Search places using the search box (top-left)

## Project Structure

```
src/
├── App.jsx              # Main app component with all layers
├── supabase.js          # Supabase client config
├── index.css            # Global styles (Tailwind)
├── atlasObscuraData.js  # Curated landmarks
├── foodData.js          # Curated restaurants
├── youtubeVideosData.js # Curated travel videos
├── heritageAudioData.js # Heritage audio recordings
├── dogParksData.js      # Dog-friendly spots
├── climateData.js       # October climate by region
└── scotlandCouncils.json # GeoJSON council boundaries
```

See [DEV.md](./DEV.md) for detailed developer documentation.
