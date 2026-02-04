# Extracting Atlas Obscura Place Data

Atlas Obscura has no official public API and blocks automated scraping (403). However, their **search endpoint** returns HTML with embedded place data including coordinates.

## Working Method

Hit the search page with location parameters:

```
https://www.atlasobscura.com/search?utf8=%E2%9C%93&q=&location={LOCATION_NAME}&lat={LAT}&lng={LNG}&formatted_address={LOCATION_NAME}&source=desktop&nearby={LOCATION_NAME}
```

### Example

```
https://www.atlasobscura.com/search?utf8=%E2%9C%93&q=&location=Edinburgh&lat=55.95&lng=-3.19&formatted_address=Edinburgh&source=desktop&nearby=Edinburgh
```

This returns ~15 results per page, each with:
- Place name
- Latitude / Longitude
- Short description
- Location text

### Coverage Strategy

Atlas Obscura search is proximity-based, so to cover all of Scotland we queried multiple center points:

| Area | Lat | Lng |
|------|-----|-----|
| Central Scotland | 56.49 | -4.20 |
| Edinburgh | 55.95 | -3.19 |
| Glasgow | 55.86 | -4.25 |
| Inverness | 57.48 | -4.22 |
| Aberdeen | 57.15 | -2.09 |
| Isle of Skye | 57.30 | -6.30 |
| Orkney | 58.98 | -3.10 |
| Dumfries | 55.07 | -3.60 |
| St Andrews | 56.34 | -2.79 |

### Notes

- Results are deduplicated manually since nearby searches overlap.
- The endpoint works via browser-style `WebFetch` but may 403 with raw `curl` depending on headers.
- No pagination parameter was found; each query returns the nearest ~15 places.
- To expand coverage, add more center points (e.g., Stirling, Dundee, Fort William, Outer Hebrides).

## Data File

Extracted places are stored in `src/atlasObscuraData.js` as a flat array of `{ name, lat, lng, description }` objects.
