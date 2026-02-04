# Scottish Trails Data

This document explains how to fetch and process hiking trail data from OpenStreetMap for the Scotland trip map.

## Data Source

Trail data comes from OpenStreetMap via the Overpass API. Major Scottish hiking trails are stored as "relations" (collections of ways/paths).

## Key Trail Relations

| Trail | Relation ID | Full Name in OSM |
|-------|-------------|------------------|
| West Highland Way | 16287 | West Highland Way - Slighe Taobh an Iar na Gàidhealtachd |
| Great Glen Way | 126572 | Great Glen Way - Slighe a' Ghlinne Mhòir |
| Southern Upland Way | - | Southern Upland Way (exact match) |
| Rob Roy Way | - | Rob Roy Way (exact match) |
| Speyside Way | - | Speyside Way (exact match) |
| Fife Coastal Path | - | Fife Coastal Path (exact match) |
| John Muir Way | - | John Muir Way (exact match) |

**Note:** West Highland Way and Great Glen Way have bilingual Gaelic names, so you need to query by relation ID, not by exact name match.

## Fetching Trail Data

### Step 1: Query Overpass API

```bash
curl -s "https://overpass-api.de/api/interpreter" --data '[out:json][timeout:120];
(
  relation(16287);
  relation(126572);
  relation["name"="Southern Upland Way"]["route"="hiking"];
  relation["name"="Rob Roy Way"]["route"="hiking"];
  relation["name"="Speyside Way"]["route"="hiking"];
  relation["name"="Fife Coastal Path"]["route"="hiking"];
  relation["name"="John Muir Way"]["route"="hiking"];
);
>>;
out geom;' -o /tmp/trails_raw.json
```

**Important:** The `>>;` operator recursively expands relations to include their member ways with geometry.

### Step 2: Convert to GeoJSON

Use the Python script below to convert the OSM data to GeoJSON:

```python
import json
import math

def simplify_line(coords, tolerance=0.002):
    """Simple distance-based point reduction (~200m at Scottish latitudes)"""
    if len(coords) < 3:
        return coords
    result = [coords[0]]
    for i in range(1, len(coords) - 1):
        prev = result[-1]
        curr = coords[i]
        dist = math.sqrt((curr[0] - prev[0])**2 + (curr[1] - prev[1])**2)
        if dist >= tolerance:
            result.append(curr)
    result.append(coords[-1])
    return result

with open('/tmp/trails_raw.json') as f:
    data = json.load(f)

# Build lookup tables
relations = {}
ways = {}

for element in data.get('elements', []):
    if element['type'] == 'relation':
        relations[element['id']] = element
    elif element['type'] == 'way':
        ways[element['id']] = element

# Map relation IDs to display names
TRAIL_IDS = {
    16287: "West Highland Way",
    126572: "Great Glen Way",
}

TRAIL_NAME_PREFIXES = [
    "Southern Upland Way",
    "Rob Roy Way",
    "Speyside Way",
    "Fife Coastal Path",
    "John Muir Way",
]

def get_display_name(rel):
    rel_id = rel['id']
    if rel_id in TRAIL_IDS:
        return TRAIL_IDS[rel_id]
    name = rel.get('tags', {}).get('name:en') or rel.get('tags', {}).get('name', '')
    for prefix in TRAIL_NAME_PREFIXES:
        if name.startswith(prefix):
            return prefix
    return name

def get_way_coords(way_id):
    way = ways.get(way_id)
    if not way or 'geometry' not in way:
        return None
    return [[pt['lon'], pt['lat']] for pt in way['geometry']]

def collect_ways_from_relation(rel_id, collected=None, visited=None):
    if collected is None:
        collected = []
    if visited is None:
        visited = set()
    if rel_id in visited:
        return collected
    visited.add(rel_id)

    rel = relations.get(rel_id)
    if not rel:
        return collected

    for member in rel.get('members', []):
        if member['type'] == 'way':
            coords = get_way_coords(member['ref'])
            if coords and len(coords) >= 2:
                collected.append(coords)
        elif member['type'] == 'relation':
            collect_ways_from_relation(member['ref'], collected, visited)
    return collected

def is_trail_relation(rel):
    if rel['id'] in TRAIL_IDS:
        return True
    tags = rel.get('tags', {})
    if tags.get('route') != 'hiking':
        return False
    name = tags.get('name:en') or tags.get('name', '')
    for prefix in TRAIL_NAME_PREFIXES:
        if name == prefix or name.startswith(prefix + ' '):
            return True
    return False

# Group by display name
from collections import defaultdict
trail_segments = defaultdict(list)
trail_websites = {}

for rel_id, rel in relations.items():
    if not is_trail_relation(rel):
        continue
    display_name = get_display_name(rel)
    website = rel.get('tags', {}).get('website', '') or rel.get('tags', {}).get('url', '')
    if website and display_name not in trail_websites:
        trail_websites[display_name] = website
    segments = collect_ways_from_relation(rel_id)
    trail_segments[display_name].extend(segments)

# Create GeoJSON with MultiLineString (keeps segments separate, no straight lines!)
features = []
for trail_name, segments in sorted(trail_segments.items()):
    simplified_segments = []
    for seg in segments:
        simplified = simplify_line(seg, tolerance=0.002)
        if len(simplified) >= 2:
            simplified_segments.append(simplified)

    if simplified_segments:
        features.append({
            "type": "Feature",
            "properties": {
                "name": trail_name,
                "website": trail_websites.get(trail_name, '')
            },
            "geometry": {
                "type": "MultiLineString",  # IMPORTANT: Use MultiLineString!
                "coordinates": simplified_segments
            }
        })

output = {"type": "FeatureCollection", "features": features}
with open('src/trailsData.json', 'w') as f:
    json.dump(output, f)
```

## Critical: Use MultiLineString

**DO NOT** merge trail segments into a single LineString by concatenating coordinates! This creates huge straight lines across the map between disconnected segments.

Instead, use **MultiLineString** geometry type which keeps each way segment separate:

```json
{
  "type": "MultiLineString",
  "coordinates": [
    [[lon1, lat1], [lon2, lat2], ...],  // segment 1
    [[lon3, lat3], [lon4, lat4], ...],  // segment 2 (separate)
    ...
  ]
}
```

## Simplification

The `simplify_line()` function reduces points using distance-based filtering:
- Tolerance of 0.002 degrees = ~200m at Scottish latitudes
- Keeps first and last points of each segment
- Removes intermediate points closer than tolerance to previous kept point

## Output

The final GeoJSON should have:
- 7 features (one per trail)
- MultiLineString geometry for each
- Properties with name and website

Typical file size: ~500KB (gzips to ~100KB)

## Troubleshooting

### "Huge straight lines across map"
You merged segments incorrectly. Use MultiLineString, not LineString.

### Missing trails (West Highland Way, Great Glen Way)
Query by relation ID (16287, 126572) since they have bilingual names.

### Empty geometry
Make sure to use `>>;` in Overpass query to recursively expand relations.

### No ways in data
Super-relations (type=superroute) contain other relations, not ways directly. The recursive `collect_ways_from_relation()` function handles this.
