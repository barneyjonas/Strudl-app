import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export interface SharedPin {
  id: string
  name: string
  lat: number
  lng: number
  address?: string
}

interface Props {
  pins: SharedPin[]
  height?: string
}

function makeIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;border-radius:12px;background:#E6C828;border:2px solid rgba(253,250,245,0.8);box-shadow:0 4px 16px rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1815" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 8h1a4 4 0 010 8h-1"/>
        <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z"/>
        <line x1="8" y1="1" x2="8" y2="4"/>
        <line x1="12" y1="1" x2="12" y2="4"/>
        <line x1="16" y1="1" x2="16" y2="4"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  })
}

export default function SharedCafeMap({ pins, height = '200px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current || mapRef.current || pins.length === 0) return

    const avgLat = pins.reduce((s, p) => s + p.lat, 0) / pins.length
    const avgLng = pins.reduce((s, p) => s + p.lng, 0) / pins.length

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([avgLat, avgLng], 13)

    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const icon = makeIcon()
    pins.forEach(pin => {
      const popup = `<div style="font-family:Inter,sans-serif;min-width:140px;">
        <div style="font-weight:800;font-size:0.9rem;color:#1A1815;margin-bottom:${pin.address ? '4px' : '0'}">${pin.name}</div>
        ${pin.address ? `<div style="font-size:0.75rem;color:#7A7060;">${pin.address}</div>` : ''}
      </div>`
      L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 220 })
    })

    if (pins.length > 1) {
      const bounds = L.latLngBounds(pins.map(p => [p.lat, p.lng] as L.LatLngTuple))
      map.fitBounds(bounds, { padding: [32, 32] })
    }

    setTimeout(() => {
      map.invalidateSize()
      setLoading(false)
    }, 300)

    const el = containerRef.current
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length < 2) map.dragging.disable()
      else map.dragging.enable()
    }
    const onTouchEnd = () => map.dragging.enable()
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      map.remove()
      mapRef.current = null
    }
  // pins is stable from useMemo in the parent — safe to use [] deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height, border: '1px solid #E8E2D8' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000]" style={{ background: '#F0EBE0' }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#E8E2D8', borderTopColor: '#1A1815' }} />
            <p className="text-sm" style={{ color: '#7A7060' }}>Loading map…</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
