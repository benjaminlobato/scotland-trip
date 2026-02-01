import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from './supabase'

const PASSWORD = import.meta.env.VITE_APP_PASSWORD

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

function PinDetail({ pin, onClose }) {
  const cat = CATEGORIES[pin.category] || CATEGORIES.other
  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-[1000] p-5 overflow-y-auto">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl">✕</button>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ background: cat.color }}
        />
        <span className="text-sm font-medium text-slate-500">{cat.label}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{pin.name}</h2>
      {pin.description && <p className="text-slate-600 mb-3">{pin.description}</p>}
      {pin.added_by && <p className="text-sm text-slate-400">Added by {pin.added_by}</p>}
    </div>
  )
}

function MapClickHandler({ onClick }) {
  useMapEvents({ click: (e) => onClick(e.latlng) })
  return null
}

function App() {
  const [authed, setAuthed] = useState(localStorage.getItem('scotland-auth') === 'true')
  const [pins, setPins] = useState([])
  const [addingAt, setAddingAt] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)

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
    setAddingAt(latlng)
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
        <MapClickHandler onClick={handleMapClick} />
        {pins.map(pin => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={makeIcon((CATEGORIES[pin.category] || CATEGORIES.other).color)}
            eventHandlers={{ click: () => handlePinClick(pin) }}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-white/90 rounded-lg shadow px-3 py-2 z-[1000]">
        <div className="flex gap-3 text-xs text-slate-700">
          {Object.values(CATEGORIES).map(c => (
            <span key={c.label} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {addingAt && (
        <AddPinForm
          latlng={addingAt}
          onSave={() => { setAddingAt(null); fetchPins() }}
          onCancel={() => setAddingAt(null)}
        />
      )}

      {selectedPin && (
        <PinDetail pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  )
}

export default App
