# Scotland Trip Map - Developer Guide

## Architecture Overview

This is a React + Vite application using Leaflet for mapping. Data comes from three sources:

1. **Curated static data** - JS files with hand-picked locations (videos, food, audio, dogs)
2. **Dynamic API queries** - OpenStreetMap Overpass (castles, accommodation), eBird (birds)
3. **Tile overlays** - Waymarked Trails (hiking), OpenRailwayMap (trains)
4. **GeoJSON polygons** - Scottish council areas with climate data

## Map Layers

| Layer | Icon | Data Source | Toggle State |
|-------|------|-------------|--------------|
| Landmarks | 🔴 | `atlasObscuraData.js` | `showAtlas` |
| Trails | Green overlay | Waymarked Trails tiles | `showTrails` |
| Dogs | 🐕 | `dogParksData.js` | `showDogs` |
| Birds | 🐦 | eBird API (dynamic) | `birds.length > 0` |
| Stays | 🏨 | Overpass API (dynamic) | `accommodation.length > 0` |
| Audio | 🎙️ | `heritageAudioData.js` | `showAudio` |
| Castles | 🏰 | Overpass API (dynamic) | `castles.length > 0` |
| Trains | 🚂 | OpenRailwayMap tiles + Overpass | `showTrains` |
| Food | 🍽️ | `foodData.js` | `showFood` |
| Videos | ▶️ | `youtubeVideosData.js` | `showVideos` |
| Climate | 🌡️ | `scotlandCouncils.json` + `climateData.js` | `showClimate` |

## Environment Variables

```bash
# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Optional (bird sightings won't work without this)
VITE_EBIRD_API_KEY=xxx
```

For Vercel deployment, set these in Project Settings → Environment Variables.

## Curated Data Files

### YouTube Videos (`src/youtubeVideosData.js`)

~40 curated travel videos, mostly Rick Steves Scotland content.

```javascript
{
  title: "Rick Steves: Edinburgh (Full Episode)",
  location: "Edinburgh",
  lat: 55.9533,
  lng: -3.1883,
  youtubeId: "Qk6B4YyQSbo",  // Just the ID, not full URL
  source: "Rick Steves"
}
```

### Food/Restaurants (`src/foodData.js`)

~28 restaurants focused on trip route (Glencoe, Oban, Skye, Orkney, Cairngorms).

```javascript
{
  name: "The Three Chimneys",
  type: "fine dining",  // seafood, fine dining, pub, fish & chips, michelin, restaurant
  location: "Colbost, Skye",
  lat: 57.4389,
  lng: -6.6478,
  description: "Legendary restaurant - Scottish cuisine in remote croft setting",
  source: "Michelin Guide"
}
```

### Heritage Audio (`src/heritageAudioData.js`)

Recordings from Tobar an Dualchais archive and YouTube.

```javascript
// External link (Tobar an Dualchais)
{
  title: "Glencoe Recording",
  location: "Glencoe",
  lat: 56.6833,
  lng: -5.1,
  url: "https://www.tobarandualchais.co.uk/track/66384",
  source: "Tobar an Dualchais"
}

// Embedded YouTube
{
  title: "Unst Boat Song (Norn)",
  location: "Unst, Shetland",
  lat: 60.7494,
  lng: -0.8856,
  youtubeId: "NrDGHCC67Hg",
  source: "Kitty Anderson (1952)"
}
```

### Climate Data (`src/climateData.js`)

October averages for all 32 Scottish council areas.

```javascript
{
  "Highland": { avgHighF: 52, avgLowF: 41, rainyDaysPct: 65, daylightHrs: 10 },
  "Orkney Islands": { avgHighF: 54, avgLowF: 45, rainyDaysPct: 58, daylightHrs: 10 },
  // ...
}
```

### Council Boundaries (`src/scotlandCouncils.json`)

GeoJSON polygons for 32 Scottish council areas. Simplified to ~95KB using mapshaper.

Source: [martinjc/UK-GeoJSON](https://github.com/martinjc/UK-GeoJSON)

## Verifying YouTube Video IDs

Before adding new videos, verify with YouTube Data API v3:

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=status&id=VIDEO_ID&key=API_KEY"
```

Valid response has `items[0].status.embeddable: true`. Invalid/private videos return empty `items: []`.

### Batch verify (up to 50 IDs)

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=status&id=ID1,ID2,ID3&key=API_KEY"
```

### Getting a YouTube API Key

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable "YouTube Data API v3"
4. Credentials → Create API Key

## Finding Coordinates

- **Google Maps**: Right-click → "What's here?"
- **OpenStreetMap**: Click location, check URL
- **Wikipedia**: Sidebar on location articles

## Dynamic Layers

### Castles, Accommodation (Overpass API)

Queries OpenStreetMap within current map bounds. Example query:

```
[out:json][timeout:30];
(
  node["historic"="castle"](BBOX);
  way["historic"="castle"](BBOX);
);
out center tags 500;
```

### Birds (eBird API)

Fetches recent sightings near map center. Requires `VITE_EBIRD_API_KEY`.

### Trains

- **Lines**: OpenRailwayMap tile overlay
- **Stations**: Overpass query for `railway=station` and `railway=halt`

## Key Components in App.jsx

- `BirdPopup` - Shows Wikipedia image, plays bird calls from Macaulay Library
- `CastlePopup` - Fetches Wikipedia image for castle
- `BirdLoader`, `CastleLoader`, `TrainLoader`, `AccommodationLoader` - Fetch data on toggle
- `SearchBox` - Uses Photon/Komoot geocoding API
- `MapClickHandler` - Handles pin creation and trail lookups

## Mobile Considerations

- Viewport uses `position: fixed` on html/body to prevent iOS bounce
- Legend collapses to single button when minimized
- Search bar narrows on small screens (`w-48 sm:w-72`)
- Add Pin button uses emoji (📍) to save space

## Build & Deploy

```bash
npm run dev      # Local development
npm run build    # Production build
```

Vercel auto-deploys on push to main. Build output is ~720KB gzipped (includes GeoJSON).

## Adding a New Layer

1. Create data file in `src/` (or use API)
2. Import in `App.jsx`
3. Add state: `const [showX, setShowX] = useState(false)`
4. Add markers/layer inside `<MapContainer>`
5. Add toggle button in legend grid
6. Update this documentation
