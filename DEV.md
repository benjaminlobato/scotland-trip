# Scotland Trip Map - Developer Guide

## Map Layers Overview

| Layer | Icon | Data Source | Description |
|-------|------|-------------|-------------|
| Castles | 🏰 | OpenStreetMap Overpass API | Dynamic query, Wikipedia images in popups |
| Trains | 🚂 | OpenRailwayMap tiles + OSM stations | Rail lines overlay + station markers |
| YouTube Videos | ▶️ | Curated (`youtubeVideosData.js`) | Embedded players in popups |
| Food | 🍽️ | Curated (`foodData.js`) | Notable restaurants along trip route |
| Heritage Audio | 🎵 | Curated (`heritageAudioData.js`) | Tobar an Dualchais + YouTube recordings |
| Birds | 🐦 | eBird API | Recent sightings (requires API key) |
| Dogs | 🐕 | Curated (`dogData.js`) | Dog-friendly locations |
| Accommodation | 🏨 | OpenStreetMap Overpass API | Hotels, hostels, B&Bs |
| Hiking Trails | - | Waymarked Trails tiles | Trail overlay |

## Environment Variables

```bash
# Required for bird sightings layer
VITE_EBIRD_API_KEY=your_ebird_api_key

# Supabase (for collaborative pins)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Curated Data Files

### YouTube Videos (`src/youtubeVideosData.js`)

```javascript
{
  title: "Video Title",
  location: "Location Name",
  lat: 56.1234,
  lng: -4.5678,
  youtubeId: "dQw4w9WgXcQ",  // Just the ID, not full URL
  source: "Channel Name"
}
```

### Food/Restaurants (`src/foodData.js`)

```javascript
{
  name: "Restaurant Name",
  type: "seafood",  // seafood, fine dining, pub, fish & chips, michelin, restaurant
  location: "Town, Region",
  lat: 56.1234,
  lng: -4.5678,
  description: "Brief description of the place",
  source: "VisitScotland"  // or "Michelin Guide", "Local favorite", etc.
}
```

### Heritage Audio (`src/heritageAudioData.js`)

```javascript
// For Tobar an Dualchais links:
{
  title: "Recording Title",
  location: "Place Name",
  lat: 56.1234,
  lng: -4.5678,
  url: "https://www.tobarandualchais.co.uk/track/12345",
  source: "Tobar an Dualchais"
}

// For YouTube audio:
{
  title: "Recording Title",
  location: "Place Name",
  lat: 56.1234,
  lng: -4.5678,
  youtubeId: "dQw4w9WgXcQ",
  source: "Performer Name"
}
```

## Verifying YouTube Video IDs

Before adding new videos, verify the ID is valid and embeddable using the YouTube Data API v3:

```bash
# Replace VIDEO_ID and API_KEY with actual values
curl "https://www.googleapis.com/youtube/v3/videos?part=status&id=VIDEO_ID&key=API_KEY"
```

**Valid response** - video exists and is embeddable:
```json
{
  "items": [{
    "status": {
      "embeddable": true,
      "privacyStatus": "public"
    }
  }]
}
```

**Invalid response** - video doesn't exist or is private:
```json
{
  "items": []
}
```

### Batch verify multiple IDs

```bash
# Comma-separated IDs (up to 50)
curl "https://www.googleapis.com/youtube/v3/videos?part=status&id=ID1,ID2,ID3&key=API_KEY"
```

### Getting a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. (Optional) Restrict key to YouTube Data API only

## Finding Coordinates

For new entries, you can get lat/lng coordinates from:

- Google Maps: Right-click → "What's here?" → coordinates appear at bottom
- OpenStreetMap: Click location → URL contains coordinates
- Wikipedia: Many location articles have coordinates in the sidebar

## Adding New Entries

1. Open the relevant data file in `src/`
2. Add your entry following the format above
3. Verify YouTube IDs if adding videos
4. Test locally with `npm run dev`
5. Commit and push
