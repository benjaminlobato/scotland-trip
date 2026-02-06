import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker, ScaleControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from './supabase'
import ATLAS_OBSCURA_PLACES from './atlasObscuraData'
import DOG_PARKS from './dogParksData'
import HERITAGE_AUDIO from './heritageAudioData'
import YOUTUBE_VIDEOS from './youtubeVideosData'

const PASSWORD = import.meta.env.VITE_APP_PASSWORD
const EBIRD_API_KEY = import.meta.env.VITE_EBIRD_API_KEY

const CATEGORIES = {
  food: { label: 'Food', color: '#ef4444' },
  pub: { label: 'Pub', color: '#f59e0b' },
  hike: { label: 'Hike', color: '#22c55e' },
  stay: { label: 'Stay', color: '#3b82f6' },
  other: { label: 'Other', color: '#8b5cf6' },
}

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const landmarkIcon = L.divIcon({
  className: '',
  html: `<div style="background:#e11d48;width:20px;height:20px;border-radius:4px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const birdIcon = L.divIcon({
  className: '',
  html: `<div style="background:#8b5cf6;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">🐦</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const dogIcon = L.divIcon({
  className: '',
  html: `<div style="background:#f97316;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">🐕</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const stayIcon = L.divIcon({
  className: '',
  html: `<div style="background:#0ea5e9;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:9px;">🏨</div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const audioIcon = L.divIcon({
  className: '',
  html: `<div style="background:#dc2626;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">🎙️</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const castleIcon = L.divIcon({
  className: '',
  html: `<div style="background:#7c3aed;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">🏰</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const videoIcon = L.divIcon({
  className: '',
  html: `<div style="background:#ef4444;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">▶️</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const trainIcon = L.divIcon({
  className: '',
  html: `<div style="background:#0891b2;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px;">🚂</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === PASSWORD) {
      localStorage.setItem('scotland-auth', 'true')
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-800">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2 text-slate-800">Scotland Trip 🏴󠁧󠁢󠁳󠁣󠁴󠁿</h1>
        <p className="text-slate-500 mb-4">Enter the password to continue</p>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false) }}
          className="w-full border border-slate-300 rounded px-3 py-2 mb-2 text-black"
          placeholder="Password"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm mb-2">Wrong password</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Enter
        </button>
      </form>
    </div>
  )
}

function AddPinForm({ latlng, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [addedBy, setAddedBy] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('pins').insert({
      name: name.trim(),
      description: description.trim() || null,
      latitude: latlng.lat,
      longitude: latlng.lng,
      category,
      added_by: addedBy.trim() || null,
    })
    setSaving(false)
    if (!error) onSave()
  }

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-[1000] p-5 overflow-y-auto">
      <h2 className="text-lg font-bold mb-3 text-slate-800">Add Pin</h2>
      <p className="text-sm text-slate-500 mb-4">
        {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name *"
          className="border border-slate-300 rounded px-3 py-2 text-black"
          autoFocus
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="border border-slate-300 rounded px-3 py-2 text-black"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-black"
        >
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <input
          value={addedBy}
          onChange={e => setAddedBy(e.target.value)}
          placeholder="Added by"
          className="border border-slate-300 rounded px-3 py-2 text-black"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-200 text-slate-700 py-2 rounded hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function PinDetail({ pin, onClose, onDelete }) {
  const isAtlas = pin.category === 'atlas'
  const cat = isAtlas ? { label: 'Landmark', color: '#e11d48' } : (CATEGORIES[pin.category] || CATEGORIES.other)
  const [wiki, setWiki] = useState(null)
  const [wikiLoading, setWikiLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isAtlas) return
    setWiki(null)
    setWikiLoading(true)
    const searchName = pin.name.replace(/['']/g, "'").replace(/\s*\(.*\)$/, '')
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.thumbnail) setWiki(data)
        else setWiki(null)
      })
      .catch(() => setWiki(null))
      .finally(() => setWikiLoading(false))
  }, [pin.name, isAtlas])

  async function handleDelete() {
    if (!pin.id) return
    setDeleting(true)
    const { error } = await supabase.from('pins').delete().eq('id', pin.id)
    setDeleting(false)
    if (!error) onDelete()
  }

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-[1000] p-5 overflow-y-auto">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl">✕</button>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-block w-3 h-3 ${isAtlas ? 'rounded-sm' : 'rounded-full'}`}
          style={{ background: cat.color }}
        />
        <span className="text-sm font-medium text-slate-500">{cat.label}</span>
      </div>
      {isAtlas && wikiLoading && <div className="h-40 bg-slate-100 rounded mb-3 animate-pulse" />}
      {wiki && wiki.thumbnail && (
        <img src={wiki.thumbnail.source} alt={pin.name} className="w-full h-40 object-cover rounded mb-3" />
      )}
      <h2 className="text-lg font-bold text-slate-800 mb-2">{pin.name}</h2>
      {pin.description && <p className="text-slate-600 mb-3">{pin.description}</p>}
      {pin.url && (
        <a href={pin.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-rose-600 hover:text-rose-800 underline mb-3">
          View on Atlas Obscura →
        </a>
      )}
      {wiki && (
        <a href={wiki.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-blue-600 hover:text-blue-800 underline mb-3 ml-2">
          Wikipedia →
        </a>
      )}
      {pin.added_by && <p className="text-sm text-slate-400 mb-4">Added by {pin.added_by}</p>}

      {/* Delete button for user-created pins */}
      {pin.id && !isAtlas && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete pin
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 bg-slate-200 text-slate-700 text-sm py-1.5 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MapClickHandler({ onClick, showTrails, onTrailFound, onTrailLoading }) {
  const map = useMap()

  useMapEvents({
    click: async (e) => {
      // If trails are visible and zoomed in enough, check for trail at click point
      if (showTrails && map.getZoom() >= 12) {
        const { lat, lng } = e.latlng
        const radius = 50 // meters

        onTrailLoading(e.latlng)

        try {
          const query = `[out:json][timeout:10];
            way["highway"~"path|footway|track"]["name"](around:${radius},${lat},${lng});
            out tags 1;
            relation["route"="hiking"](around:${radius},${lat},${lng});
            out tags 3;`

          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
          })
          const data = await response.json()

          const trails = data.elements
            ?.filter(el => el.tags?.name)
            ?.map(el => el.tags.name)
            ?.filter((name, i, arr) => arr.indexOf(name) === i) // unique

          onTrailLoading(null)

          if (trails && trails.length > 0) {
            onTrailFound(e.latlng, trails)
            return // Don't trigger normal click handler
          }
        } catch (err) {
          onTrailLoading(null)
          // Ignore errors, fall through to normal click
        }
      }

      onClick(e.latlng)
    }
  })
  return null
}

function SearchBox({ onSelectLocation }) {
  const map = useMap()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=56.8&lon=-4.2&limit=6&lang=en`
        )
        const data = await response.json()
        setResults(data.features || [])
      } catch (err) {
        setResults([])
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  function handleSelect(feature) {
    const [lng, lat] = feature.geometry.coordinates
    map.flyTo([lat, lng], 14)
    setQuery('')
    setResults([])
    setShowResults(false)
    onSelectLocation({ lat, lng })
  }

  function formatResult(feature) {
    const p = feature.properties
    const parts = [p.name]
    if (p.city && p.city !== p.name) parts.push(p.city)
    if (p.county) parts.push(p.county)
    if (p.country) parts.push(p.country)
    return parts.slice(0, 3).join(', ')
  }

  return (
    <div className="absolute top-4 left-14 z-[1000] w-72">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true) }}
          onFocus={() => setShowResults(true)}
          placeholder="Search places..."
          className="w-full px-4 py-2 bg-white rounded-lg shadow border-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-2.5 text-slate-400 text-sm">...</div>
        )}
      </div>
      {showResults && results.length > 0 && (
        <div className="mt-1 bg-white rounded-lg shadow-lg overflow-hidden">
          {results.map((feature, i) => (
            <button
              key={i}
              onClick={() => handleSelect(feature)}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 border-b border-slate-100 last:border-0"
            >
              <div className="font-medium">{feature.properties.name}</div>
              <div className="text-xs text-slate-500">{formatResult(feature)}</div>
            </button>
          ))}
        </div>
      )}
      {showResults && query.length >= 2 && !loading && results.length === 0 && (
        <div className="mt-1 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-slate-500">
          No results found
        </div>
      )}
    </div>
  )
}

function CastlePopup({ castle }) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    // Try Wikipedia article first, then fall back to castle name search
    const wikiTitle = castle.wikipedia?.replace(/^en:/, '') || castle.name
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.thumbnail?.source) setImage(data.thumbnail.source)
      })
      .catch(() => {})
  }, [castle.wikipedia, castle.name])

  return (
    <div className="text-sm min-w-[180px]">
      {image && <img src={image} alt={castle.name} className="w-full h-24 object-cover rounded mb-2" />}
      <div className="font-bold text-violet-700">{castle.name}</div>
      {castle.ruins && <div className="text-xs text-slate-500 italic">Ruins</div>}
      <div className="flex gap-2 mt-1">
        {castle.wikipedia && (
          <a
            href={`https://en.wikipedia.org/wiki/${castle.wikipedia.replace(/^en:/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Wikipedia
          </a>
        )}
        {castle.website && (
          <a href={castle.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            Website
          </a>
        )}
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(castle.name + ' Scotland')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Search
        </a>
      </div>
    </div>
  )
}

function BirdPopup({ bird }) {
  const [image, setImage] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useState(() => new Audio())[0]

  useEffect(() => {
    // Fetch Wikipedia image
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bird.comName)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.thumbnail?.source) setImage(data.thumbnail.source)
      })
      .catch(() => {})

    // Fetch bird call from Macaulay Library using species code
    fetch(`https://search.macaulaylibrary.org/api/v1/search?taxonCode=${bird.speciesCode}&mediaType=audio&count=1`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.results?.content?.[0]?.mediaUrl) {
          setAudioUrl(data.results.content[0].mediaUrl)
        }
      })
      .catch(() => {})

    return () => {
      audioRef.pause()
      audioRef.src = ''
    }
  }, [bird.comName, bird.speciesCode, audioRef])

  function togglePlay() {
    if (playing) {
      audioRef.pause()
      setPlaying(false)
    } else if (audioUrl) {
      audioRef.src = audioUrl
      audioRef.play()
      setPlaying(true)
      audioRef.onended = () => setPlaying(false)
    }
  }

  return (
    <div className="text-sm min-w-[180px]">
      {image && <img src={image} alt={bird.comName} className="w-full h-24 object-contain rounded mb-2" />}
      <div className="flex items-center gap-2">
        <div className="font-bold text-purple-700">{bird.comName}</div>
        {audioUrl && (
          <button
            onClick={togglePlay}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${playing ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
            title="Play bird call"
          >
            {playing ? '⏹' : '🎵'}
          </button>
        )}
      </div>
      <div className="text-xs text-slate-500 italic">{bird.sciName}</div>
      <div className="text-xs text-slate-600 mt-1">{bird.locName}</div>
      <div className="text-xs text-slate-400">{bird.obsDt}</div>
      {bird.howMany && <div className="text-xs text-slate-600">Count: {bird.howMany}</div>}
      <div className="flex gap-2 mt-2">
        <a
          href={`https://ebird.org/species/${bird.speciesCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          eBird →
        </a>
        <a
          href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(bird.comName + ' bird')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Images →
        </a>
      </div>
    </div>
  )
}

function BirdLoader({ onComplete }) {
  const map = useMap()

  useEffect(() => {
    let cancelled = false

    async function fetchBirds() {
      const center = map.getCenter()
      const bounds = map.getBounds()

      // Calculate radius based on viewport (rough estimate in km)
      const latDiff = bounds.getNorth() - bounds.getSouth()
      const dist = Math.min(50, Math.max(10, Math.round(latDiff * 55))) // ~55km per degree lat

      try {
        const response = await fetch(
          `https://api.ebird.org/v2/data/obs/geo/recent?lat=${center.lat}&lng=${center.lng}&dist=${dist}&back=30&maxResults=200`,
          { headers: { 'X-eBirdApiToken': EBIRD_API_KEY } }
        )
        const data = await response.json()
        if (!cancelled) onComplete(data || [])
      } catch (err) {
        if (!cancelled) onComplete([])
      }
    }

    fetchBirds()

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function AccommodationLoader({ onComplete }) {
  const map = useMap()

  useEffect(() => {
    let cancelled = false

    async function fetchAccommodation() {
      const bounds = map.getBounds()
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`

      const query = `[out:json][timeout:30];
        (
          node["tourism"~"hotel|hostel|guest_house|camp_site"](${bbox});
          way["tourism"~"hotel|hostel|guest_house|camp_site"](${bbox});
        );
        out center tags 500;`

      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        })
        const data = await response.json()
        const places = data.elements?.map(el => ({
          name: el.tags?.name || 'Unnamed',
          type: el.tags?.tourism,
          website: el.tags?.website,
          phone: el.tags?.phone,
          stars: el.tags?.stars,
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
        })).filter(p => p.lat && p.lng) || []
        if (!cancelled) onComplete(places)
      } catch (err) {
        if (!cancelled) onComplete([])
      }
    }

    fetchAccommodation()

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function CastleLoader({ onComplete }) {
  const map = useMap()

  useEffect(() => {
    let cancelled = false

    async function fetchCastles() {
      const bounds = map.getBounds()
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`

      const query = `[out:json][timeout:30];
        (
          node["historic"="castle"](${bbox});
          way["historic"="castle"](${bbox});
          relation["historic"="castle"](${bbox});
        );
        out center tags 500;`

      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        })
        const data = await response.json()
        const castles = data.elements?.map(el => ({
          name: el.tags?.name || 'Unnamed Castle',
          ruins: el.tags?.ruins === 'yes' || el.tags?.castle_type === 'ruins',
          wikipedia: el.tags?.wikipedia,
          website: el.tags?.website,
          wikidata: el.tags?.wikidata,
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
        })).filter(c => c.lat && c.lng) || []
        if (!cancelled) onComplete(castles)
      } catch (err) {
        if (!cancelled) onComplete([])
      }
    }

    fetchCastles()

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function TrainLoader({ onComplete }) {
  const map = useMap()

  useEffect(() => {
    let cancelled = false

    async function fetchTrains() {
      const bounds = map.getBounds()
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`

      // Query for stations only (rail lines are too dense)
      const query = `[out:json][timeout:25];
        (
          node["railway"="station"](${bbox});
          node["railway"="halt"](${bbox});
        );
        out tags 300;`

      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        })
        const data = await response.json()

        const stations = data.elements
          ?.map(el => ({
            name: el.tags?.name || 'Unnamed Station',
            operator: el.tags?.operator,
            network: el.tags?.network,
            lat: el.lat,
            lng: el.lon,
          }))
          .filter(s => s.lat && s.lng && s.name !== 'Unnamed Station') || []

        if (!cancelled) onComplete(stations)
      } catch (err) {
        if (!cancelled) onComplete([])
      }
    }

    fetchTrains()

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function App() {
  const [authed, setAuthed] = useState(localStorage.getItem('scotland-auth') === 'true')
  const [pins, setPins] = useState([])
  const [addingAt, setAddingAt] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  const [showAtlas, setShowAtlas] = useState(true)
  const [showTrails, setShowTrails] = useState(true)
  const [trailPopup, setTrailPopup] = useState(null) // { latlng, trails }
  const [trailLoading, setTrailLoading] = useState(null) // latlng while loading
  const [mode, setMode] = useState('select') // 'select' or 'create'
  const [birds, setBirds] = useState([])
  const [birdsLoading, setBirdsLoading] = useState(false)
  const [showDogs, setShowDogs] = useState(false)
  const [accommodation, setAccommodation] = useState([])
  const [accommodationLoading, setAccommodationLoading] = useState(false)
  const [castles, setCastles] = useState([])
  const [castlesLoading, setCastlesLoading] = useState(false)
  const [trains, setTrains] = useState([])
  const [trainsLoading, setTrainsLoading] = useState(false)
  const [showAudio, setShowAudio] = useState(true)
  const [showVideos, setShowVideos] = useState(false)
  const [legendOpen, setLegendOpen] = useState(true)

  const fetchPins = useCallback(async () => {
    const { data } = await supabase.from('pins').select('*').order('created_at', { ascending: false })
    if (data) setPins(data)
  }, [])

  useEffect(() => {
    if (authed) fetchPins()
  }, [authed, fetchPins])

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />

  function handleMapClick(latlng) {
    setSelectedPin(null)
    setTrailPopup(null)
    if (mode === 'create') {
      setAddingAt(latlng)
    } else {
      setAddingAt(null)
    }
  }

  function handlePinClick(pin) {
    setAddingAt(null)
    setSelectedPin(pin)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[56.8, -4.2]}
        zoom={7}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl position="bottomright" imperial={false} />
        <SearchBox onSelectLocation={(latlng) => { setSelectedPin(null); setAddingAt(latlng) }} />
        <MapClickHandler
          onClick={handleMapClick}
          showTrails={showTrails}
          onTrailLoading={(latlng) => {
            setTrailPopup(null)
            setTrailLoading(latlng)
          }}
          onTrailFound={(latlng, trails) => {
            setAddingAt(null)
            setSelectedPin(null)
            setTrailLoading(null)
            setTrailPopup({ latlng, trails })
          }}
        />
        {pins.map(pin => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={makeIcon((CATEGORIES[pin.category] || CATEGORIES.other).color)}
            eventHandlers={{ click: () => handlePinClick(pin) }}
          />
        ))}
        {showAtlas && ATLAS_OBSCURA_PLACES.map((place, i) => (
          <Marker
            key={`atlas-${i}`}
            position={[place.lat, place.lng]}
            icon={landmarkIcon}
            eventHandlers={{ click: () => {
              setAddingAt(null)
              setSelectedPin({ name: place.name, description: place.description, category: 'atlas', url: place.url })
            }}}
          />
        ))}
        {showTrails && (
          <TileLayer
            url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://waymarkedtrails.org">Waymarked Trails</a>'
            opacity={0.7}
          />
        )}
        {birdsLoading && (
          <BirdLoader
            onComplete={(data) => { setBirds(data); setBirdsLoading(false) }}
          />
        )}
        {birds.map((bird, i) => (
          <Marker
            key={`bird-${i}-${bird.subId}`}
            position={[bird.lat, bird.lng]}
            icon={birdIcon}
          >
            <Popup>
              <BirdPopup bird={bird} />
            </Popup>
          </Marker>
        ))}
        {showDogs && DOG_PARKS.map((park, i) => (
          <Marker
            key={`dog-${i}`}
            position={[park.lat, park.lng]}
            icon={dogIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-orange-600">{park.name}</div>
                <a
                  href={`https://www.google.com/maps/@${park.lat},${park.lng},18z/data=!3m1!1e3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        {accommodationLoading && (
          <AccommodationLoader
            onComplete={(data) => { setAccommodation(data); setAccommodationLoading(false) }}
          />
        )}
        {accommodation.map((place, i) => (
          <Marker
            key={`stay-${i}-${place.lat}`}
            position={[place.lat, place.lng]}
            icon={stayIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-sky-600">{place.name}</div>
                <div className="text-xs text-slate-500 capitalize">{place.type?.replace('_', ' ')}</div>
                {place.stars && <div className="text-xs text-amber-500">{'★'.repeat(parseInt(place.stars))}</div>}
                <div className="flex gap-2 mt-1">
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Website
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(place.name + ' Scotland')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Search
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {castlesLoading && (
          <CastleLoader
            onComplete={(data) => { setCastles(data); setCastlesLoading(false) }}
          />
        )}
        {castles.map((castle, i) => (
          <Marker
            key={`castle-${i}-${castle.lat}`}
            position={[castle.lat, castle.lng]}
            icon={castleIcon}
          >
            <Popup>
              <CastlePopup castle={castle} />
            </Popup>
          </Marker>
        ))}
        {trainsLoading && (
          <TrainLoader
            onComplete={(data) => { setTrains(data); setTrainsLoading(false) }}
          />
        )}
        {trains.map((station, i) => (
          <Marker
            key={`station-${i}-${station.lat}`}
            position={[station.lat, station.lng]}
            icon={trainIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-cyan-700">{station.name}</div>
                {station.operator && <div className="text-xs text-slate-500">{station.operator}</div>}
                <div className="flex gap-2 mt-1">
                  <a
                    href={`https://www.scotrail.co.uk/plan-your-journey`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    ScotRail
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=transit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {showAudio && HERITAGE_AUDIO.map((audio, i) => (
          <Marker
            key={`audio-${i}`}
            position={[audio.lat, audio.lng]}
            icon={audioIcon}
          >
            <Popup minWidth={audio.youtubeId ? 280 : 160}>
              <div className="text-sm">
                <div className="font-bold text-red-600">{audio.title}</div>
                <div className="text-xs text-slate-500">{audio.location}</div>
                <div className="text-xs text-slate-400 mt-1">{audio.source}</div>
                {audio.youtubeId ? (
                  <iframe
                    className="mt-2 rounded"
                    width="260"
                    height="146"
                    src={`https://www.youtube.com/embed/${audio.youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={audio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-red-600 hover:text-red-800 hover:underline"
                  >
                    🎧 Listen →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {showVideos && YOUTUBE_VIDEOS.map((video, i) => (
          <Marker
            key={`video-${i}`}
            position={[video.lat, video.lng]}
            icon={videoIcon}
          >
            <Popup minWidth={280}>
              <div className="text-sm">
                <div className="font-bold text-red-600">{video.title}</div>
                <div className="text-xs text-slate-500">{video.location}</div>
                <div className="text-xs text-slate-400 mt-1">{video.source}</div>
                <iframe
                  className="mt-2 rounded"
                  width="260"
                  height="146"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Popup>
          </Marker>
        ))}
        {trailLoading && (
          <CircleMarker
            center={[trailLoading.lat, trailLoading.lng]}
            radius={12}
            fillColor="#16a34a"
            fillOpacity={0.3}
            color="#16a34a"
            weight={2}
            dashArray="4"
            eventHandlers={{ add: (e) => e.target.openPopup() }}
          >
            <Popup autoClose={false} closeOnClick={false}>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                Looking up trail...
              </div>
            </Popup>
          </CircleMarker>
        )}
        {trailPopup && (
          <CircleMarker
            center={[trailPopup.latlng.lat, trailPopup.latlng.lng]}
            radius={8}
            fillColor="#16a34a"
            fillOpacity={0.8}
            color="white"
            weight={2}
            eventHandlers={{ add: (e) => e.target.openPopup() }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-green-700 mb-1">Trail{trailPopup.trails.length > 1 ? 's' : ''}</div>
                {trailPopup.trails.map((name, i) => (
                  <a
                    key={i}
                    href={`https://www.google.com/search?q=${encodeURIComponent(name + ' trail Scotland')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Mode Toggle */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <button
          onClick={() => { setMode('select'); setAddingAt(null) }}
          className={`px-3 py-2 rounded-lg shadow text-sm font-medium transition-colors ${
            mode === 'select'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Select
        </button>
        <button
          onClick={() => setMode('create')}
          className={`px-3 py-2 rounded-lg shadow text-sm font-medium transition-colors ${
            mode === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Add Pin
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-white/95 rounded-lg shadow-lg z-[1000] text-xs">
        <button
          onClick={() => setLegendOpen(s => !s)}
          className="w-full px-3 py-2 flex items-center justify-between text-slate-700 font-medium hover:bg-slate-50 rounded-t-lg"
        >
          <span>Layers</span>
          <span className={`transition-transform ${legendOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {legendOpen && (
          <div className="px-3 pb-3 space-y-2">
            {/* Pin categories */}
            <div className="flex gap-2 flex-wrap text-slate-600 pb-2 border-b border-slate-200">
              {Object.values(CATEGORIES).map(c => (
                <span key={c.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
            {/* Layer toggles */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setShowAtlas(s => !s)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${showAtlas ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'}`}
              >
                <span className="w-2 h-2 rounded-sm" style={{ background: '#e11d48' }} />
                Landmarks
              </button>
              <button
                onClick={() => setShowTrails(s => !s)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${showTrails ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}
              >
                <span className="w-3 h-0.5" style={{ background: '#16a34a' }} />
                Trails
              </button>
              <button
                onClick={() => setShowDogs(s => !s)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${showDogs ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}
              >
                🐕 Dogs
              </button>
              <button
                onClick={() => birds.length > 0 ? setBirds([]) : setBirdsLoading(true)}
                disabled={birdsLoading}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${birds.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} disabled:opacity-50`}
              >
                {birdsLoading ? (
                  <><span className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /> Loading</>
                ) : (
                  <>🐦 {birds.length > 0 ? 'Bye Birds' : 'Hi Birds'}</>
                )}
              </button>
              <button
                onClick={() => accommodation.length > 0 ? setAccommodation([]) : setAccommodationLoading(true)}
                disabled={accommodationLoading}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${accommodation.length > 0 ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} disabled:opacity-50`}
              >
                {accommodationLoading ? (
                  <><span className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" /> Loading</>
                ) : (
                  <>🏨 {accommodation.length > 0 ? `Stays (${accommodation.length})` : 'Stays'}</>
                )}
              </button>
              <button
                onClick={() => setShowAudio(s => !s)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${showAudio ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}
              >
                🎙️ Audio
              </button>
              <button
                onClick={() => castles.length > 0 ? setCastles([]) : setCastlesLoading(true)}
                disabled={castlesLoading}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${castles.length > 0 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} disabled:opacity-50`}
              >
                {castlesLoading ? (
                  <><span className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /> Loading</>
                ) : (
                  <>🏰 {castles.length > 0 ? `Castles (${castles.length})` : 'Castles'}</>
                )}
              </button>
              <button
                onClick={() => trains.length > 0 ? setTrains([]) : setTrainsLoading(true)}
                disabled={trainsLoading}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${trains.length > 0 ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} disabled:opacity-50`}
              >
                {trainsLoading ? (
                  <><span className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" /> Loading</>
                ) : (
                  <>🚂 {trains.length > 0 ? `Trains (${trains.length})` : 'Trains'}</>
                )}
              </button>
              <button
                onClick={() => setShowVideos(s => !s)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left ${showVideos ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}
              >
                ▶️ Videos
              </button>
            </div>
          </div>
        )}
      </div>

      {addingAt && (
        <AddPinForm
          latlng={addingAt}
          onSave={() => { setAddingAt(null); setMode('select'); fetchPins() }}
          onCancel={() => { setAddingAt(null); setMode('select') }}
        />
      )}

      {selectedPin && (
        <PinDetail
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onDelete={() => { setSelectedPin(null); fetchPins() }}
        />
      )}
    </div>
  )
}

export default App
