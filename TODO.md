# Scotland Trip Map - Feature Ideas

## Easy to Add (Free APIs)

### Bird Sightings - eBird
- [ ] Get eBird API key from https://ebird.org/api/keygen
- [ ] Fetch recent sightings: `GET https://api.ebird.org/v2/data/obs/geo/recent?lat={lat}&lng={lng}`
- [ ] Display as toggleable layer with bird icons
- [ ] Show species name, date, location in popup

### Wildlife Sightings - iNaturalist
- [ ] No API key needed
- [ ] Endpoint: `https://api.inaturalist.org/v1/observations?lat={lat}&lng={lng}&radius=50`
- [ ] Filter by iconic_taxa (birds, mammals, reptiles, etc.)
- [ ] Show photo thumbnails in popups

### Live Webcams - Windy
- [ ] Get API key from https://api.windy.com/webcams
- [ ] Fetch nearby: `GET https://api.windy.com/api/webcams/v2/list/nearby={lat},{lng},{radius}`
- [ ] Show webcam thumbnails, link to live view
- [ ] Great for checking weather at destinations

### Weather Forecasts - Open-Meteo
- [ ] No API key needed
- [ ] Endpoint: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&daily=temperature_2m_max,precipitation_sum`
- [ ] Show forecast when clicking on any location
- [ ] Could add weather overlay option

## Scotland-Specific (OpenStreetMap/Overpass)

### Whisky Distilleries
- [ ] Query: `node["craft"="distillery"](scotland bbox); way["craft"="distillery"](scotland bbox);`
- [ ] Also try: `node["industrial"="distillery"]` or `node["man_made"="works"]["product"="whisky"]`
- [ ] Add whisky glass icon
- [ ] Include website links where available
- [ ] Could note if visitor center/tours available

### Castles
- [ ] Query: `node["historic"="castle"]; way["historic"="castle"];`
- [ ] Hundreds in Scotland
- [ ] Differentiate ruins vs intact
- [ ] Link to Historic Scotland / Wikipedia

### Munros (Peaks over 3000ft / 914m)
- [ ] Query: `node["natural"="peak"]["ele"~"^9[1-9][4-9]|^[1-9][0-9]{3}"]` (914m+)
- [ ] Show elevation in popup
- [ ] Link to walkhighlands.co.uk for route info
- [ ] Could track "bagged" peaks with local storage

### Dark Sky Sites
- [ ] Manually curate list:
  - Galloway Forest Dark Sky Park
  - Cairngorms (Tomintoul & Glenlivet)
  - Coll & Tiree (islands)
  - Flow Country
- [ ] Show best viewing conditions
- [ ] Link to darkskydiscovery.org.uk

### Tide Times
- [ ] UK Hydrographic Office API or Admiralty EasyTide
- [ ] Important for: Staffa boat trips, coastal walks, Orkney causeways
- [ ] Show high/low tide times for coastal locations

## Harder / Paid APIs

### Hotel Listings
- [ ] Booking.com Affiliate API (requires approval)
- [ ] Alternative: Link to search results on Booking/Airbnb
- [ ] Could scrape Google Hotels (risky)

### Ferry Schedules - CalMac
- [ ] No public API
- [ ] Could manually add key routes:
  - Oban → Mull/Iona
  - Mallaig → Skye
  - Scrabster → Orkney
- [ ] Link to calmac.co.uk booking pages

### Train Stations & Scenic Routes
- [ ] Query stations from OSM: `node["railway"="station"]`
- [ ] Highlight scenic lines:
  - West Highland Line (Glasgow → Mallaig)
  - Kyle Line (Inverness → Kyle of Lochalsh)
  - Far North Line (Inverness → Thurso)
- [ ] Link to ScotRail journey planner

## UI Improvements

- [ ] Layer control panel (collapse all toggles into one menu)
- [ ] Filter landmarks by type
- [ ] Save favorite pins to local storage
- [ ] Share trip plan via URL
- [ ] Mobile-friendly bottom sheet for details
- [ ] Offline support with service worker

## Data Improvements

- [ ] Add more landmarks for:
  - Beaches
  - Viewpoints (from OSM)
  - Lochs worth visiting
  - Standing stones / ancient sites
- [ ] Better descriptions for existing landmarks
- [ ] Add photos where possible (Wikimedia Commons)
