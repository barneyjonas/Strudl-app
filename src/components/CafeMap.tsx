import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { VIENNA_CAFES, type CafePin } from '../data/viennaCafes'

type MarkerState = 'loyal' | 'saved' | 'discoverable'

interface Props {
  loyalCafeNames: string[]
  savedCafeIds?: string[]
  onSaveToggle?: (cafeId: string) => void
  onCafeSelect?: (cafe: CafePin) => void
  onMapClick?: () => void
  fullScreen?: boolean
  height?: string
}

function makeMarkerIcon(state: MarkerState): L.DivIcon {
  if (state === 'discoverable') {
    return L.divIcon({
      className: '',
      html: `<div style="width:22px;height:22px;border-radius:50%;background:#fff;border:1.5px solid #0f0f0f;box-shadow:0 2px 8px rgba(0,0,0,0.18);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -14],
    })
  }
  if (state === 'saved') {
    return L.divIcon({
      className: '',
      html: `<div style="width:26px;height:26px;border-radius:50%;background:#E6C828;border:2.5px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.2);"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -16],
    })
  }
  return L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:10px;background:#E6C828;border:2px solid rgba(255,255,255,0.8);box-shadow:0 4px 14px rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0f0f0f" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  })
}

function makePopupContent(cafe: CafePin, isLoyal: boolean, isSaved: boolean): string {
  const tags = cafe.tags.map(t => `<span class="strudl-map-tag">${t}</span>`).join('')
  const loyalBadge = isLoyal ? `<div class="strudl-map-loyal-badge">Your café ✓</div>` : ''
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`
  const bookmarkSvg = isSaved
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>`
  return `<div class="strudl-map-popup">
    <div class="strudl-map-popup-name">${cafe.name}</div>
    ${loyalBadge}
    <div class="strudl-map-popup-addr">${cafe.address}</div>
    <div class="strudl-map-tags">${tags}</div>
    <div class="strudl-map-popup-actions">
      <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="strudl-map-directions-btn">Directions</a>
      <button class="strudl-map-save-btn${isSaved ? ' saved' : ''}" onclick="window.__strudlToggleSave('${cafe.id}')" title="${isSaved ? 'Unsave café' : 'Save café'}">${bookmarkSvg}</button>
    </div>
  </div>`
}

const DEFAULT_LAT = 48.2082
const DEFAULT_LNG = 16.3738

export default function CafeMap({ loyalCafeNames, savedCafeIds = [], onSaveToggle, onCafeSelect, onMapClick, fullScreen = false, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const userDotRef = useRef<L.CircleMarker | null>(null)
  const circle5Ref = useRef<L.Circle | null>(null)
  const circle10Ref = useRef<L.Circle | null>(null)
  const label5Ref = useRef<L.Marker | null>(null)
  const label10Ref = useRef<L.Marker | null>(null)
  const userLatLngRef = useRef<[number, number]>([DEFAULT_LAT, DEFAULT_LNG])
  const savedCafeIdsRef = useRef(savedCafeIds)
  savedCafeIdsRef.current = savedCafeIds
  const onSaveToggleRef = useRef(onSaveToggle)
  onSaveToggleRef.current = onSaveToggle
  const onCafeSelectRef = useRef(onCafeSelect)
  onCafeSelectRef.current = onCafeSelect
  const onMapClickRef = useRef(onMapClick)
  onMapClickRef.current = onMapClick
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showToastRef = useRef((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  })

  const flyToUser = () => {
    if (mapRef.current) mapRef.current.flyTo(userLatLngRef.current, 15, { duration: 1 })
  }

  useEffect(() => {
    ;(window as any).__strudlToggleSave = (cafeId: string) => {
      const isSaved = savedCafeIdsRef.current.includes(cafeId)
      onSaveToggleRef.current?.(cafeId)
      showToastRef.current(isSaved ? 'Removed from your list' : 'Saved to your list')
    }
    return () => {
      delete (window as any).__strudlToggleSave
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([DEFAULT_LAT, DEFAULT_LNG], 13)

    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const zoom = L.control.zoom({ position: 'bottomright' })
    zoom.addTo(map)
    const zoomEl = zoom.getContainer()
    if (zoomEl) {
      zoomEl.style.marginBottom = '96px'
      zoomEl.style.marginRight = '10px'
    }

    const attrEl = (map as any).attributionControl.getContainer() as HTMLElement | undefined
    if (attrEl) {
      attrEl.style.marginBottom = '96px'
      attrEl.style.marginRight = '10px'
      attrEl.style.fontSize = '10px'
    }

    const circleStyle = { color: '#E6C828', weight: 1.5, dashArray: '6 6', fillOpacity: 0 }
    circle5Ref.current = L.circle([DEFAULT_LAT, DEFAULT_LNG], { radius: 400, ...circleStyle }).addTo(map)
    circle10Ref.current = L.circle([DEFAULT_LAT, DEFAULT_LNG], { radius: 800, ...circleStyle }).addTo(map)

    const labelStyle = 'background:transparent;border:none;box-shadow:none;font-size:11px;font-weight:600;color:#E6C828;white-space:nowrap;'
    label5Ref.current = L.marker([DEFAULT_LAT + 0.0036, DEFAULT_LNG], {
      icon: L.divIcon({ className: '', html: `<span style="${labelStyle}">5 Min</span>`, iconAnchor: [20, 6] }),
      interactive: false,
    }).addTo(map)
    label10Ref.current = L.marker([DEFAULT_LAT + 0.0072, DEFAULT_LNG], {
      icon: L.divIcon({ className: '', html: `<span style="${labelStyle}">10 Min</span>`, iconAnchor: [24, 6] }),
      interactive: false,
    }).addTo(map)

    userDotRef.current = L.circleMarker([DEFAULT_LAT, DEFAULT_LNG], {
      radius: 8,
      color: '#fff',
      weight: 2.5,
      fillColor: '#3b82f6',
      fillOpacity: 1,
    }).addTo(map)

    // Request real GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          userLatLngRef.current = [lat, lng]
          userDotRef.current?.setLatLng([lat, lng])
          circle5Ref.current?.setLatLng([lat, lng])
          circle10Ref.current?.setLatLng([lat, lng])
          label5Ref.current?.setLatLng([lat + 0.0036, lng])
          label10Ref.current?.setLatLng([lat + 0.0072, lng])
          map.flyTo([lat, lng], 15, { duration: 1.5 })
        },
        () => { /* permission denied — keep Vienna default */ },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }

    map.on('click', () => {
      onMapClickRef.current?.()
    })

    VIENNA_CAFES.forEach((cafe) => {
      const isLoyal = loyalCafeNames.includes(cafe.name)
      const isSaved = savedCafeIdsRef.current.includes(cafe.id)
      const state: MarkerState = isLoyal ? 'loyal' : isSaved ? 'saved' : 'discoverable'
      const marker = L.marker([cafe.lat, cafe.lng], { icon: makeMarkerIcon(state) }).addTo(map)

      if (onCafeSelectRef.current) {
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e)
          onCafeSelectRef.current!(cafe)
        })
      } else {
        marker.bindPopup(makePopupContent(cafe, isLoyal, isSaved), { maxWidth: 260 })
      }

      markersRef.current.set(cafe.id, marker)
    })

    setTimeout(() => {
      map.invalidateSize()
      setLoading(false)
    }, 300)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
      userDotRef.current = null
      circle5Ref.current = null
      circle10Ref.current = null
      label5Ref.current = null
      label10Ref.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    markersRef.current.forEach((marker, cafeId) => {
      const cafe = VIENNA_CAFES.find(c => c.id === cafeId)
      if (!cafe) return
      const isLoyal = loyalCafeNames.includes(cafe.name)
      const isSaved = savedCafeIds.includes(cafeId)
      const state: MarkerState = isLoyal ? 'loyal' : isSaved ? 'saved' : 'discoverable'
      marker.setIcon(makeMarkerIcon(state))
      if (!onCafeSelectRef.current) {
        marker.setPopupContent(makePopupContent(cafe, isLoyal, isSaved))
      }
    })
  }, [savedCafeIds, loyalCafeNames])

  const containerStyle = fullScreen ? undefined : { height: height ?? 'calc(100svh - 300px)' }

  return (
    <div
      className={
        fullScreen
          ? 'absolute inset-0 overflow-hidden'
          : 'relative rounded-2xl overflow-hidden border border-[#dadada]'
      }
      style={containerStyle}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000]" style={{ background: '#1A1815' }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#E6C828] rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Finding cafés near you…</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={flyToUser}
        className="absolute left-3 bottom-[76px] z-[1001] rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: 'rgba(26,24,21,0.82)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        title="Centre on location"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDFAF5" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" fill="#FDFAF5" />
          {/* tick marks */}
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
        </svg>
      </button>
      {toast && (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-[#0f0f0f] text-white text-xs px-4 py-2 rounded-full z-[2000] whitespace-nowrap pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
