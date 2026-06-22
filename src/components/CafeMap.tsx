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
  const bg = state === 'discoverable' ? '#fff' : '#E6C828'
  const border = state === 'discoverable' ? '#000000' : '#F8EFBD'
  const fill = '#000000'
  return L.divIcon({
    className: '',
    html: `<div style="width:40px;height:40px;border-radius:14px;background:${bg};border:2px solid ${border};box-shadow:0 6px 20px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.14);overflow:hidden;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="250 -20 720 720" width="35" height="35" style="display:block;"><g transform="translate(0,720) scale(0.1,-0.1)" fill="${fill}" stroke="none"><path d="M6180 6374 c-672 -46 -1270 -306 -1737 -758 -233 -225 -403 -455 -541 -734 -150 -303 -231 -592 -263 -946 -15 -156 -6 -579 14 -703 79 -483 266 -907 564 -1278 96 -119 305 -325 423 -417 564 -437 1315 -672 2005 -628 548 34 1020 187 1438 464 125 83 347 262 347 280 0 14 -278 306 -292 306 -5 0 -74 -48 -153 -108 -261 -195 -446 -296 -690 -376 -246 -80 -447 -114 -740 -123 -575 -17 -1134 158 -1597 499 -104 76 -300 268 -383 373 -278 355 -447 769 -486 1198 -16 176 -6 512 20 657 41 226 104 416 213 635 288 579 809 992 1458 1155 198 50 323 64 555 65 230 0 348 -12 559 -56 739 -154 1287 -647 1456 -1309 38 -148 50 -240 56 -430 7 -199 -2 -324 -37 -494 -118 -584 -508 -1003 -1059 -1137 -83 -20 -121 -23 -295 -24 -270 0 -296 9 -212 75 120 96 243 238 328 377 l36 60 99 6 c240 15 465 130 609 310 118 147 158 311 120 490 -47 225 -218 346 -487 347 l-88 0 0 33 c0 50 -39 118 -80 139 -133 67 -497 107 -985 108 -574 0 -1004 -50 -1125 -132 -71 -49 -75 -60 -78 -259 -11 -584 166 -1082 512 -1438 300 -309 693 -494 1145 -540 356 -37 711 30 1031 195 165 85 288 174 433 313 319 308 502 685 567 1172 85 641 -80 1255 -468 1739 -378 471 -994 793 -1674 874 -126 15 -420 27 -518 20z m520 -2094 c343 -23 533 -66 514 -115 -32 -83 -609 -146 -1124 -125 -247 11 -491 33 -566 51 -119 29 -156 72 -89 103 75 36 363 80 580 89 176 8 553 6 685 -3z m947 -386 c49 -24 63 -38 88 -84 25 -47 29 -66 30 -130 0 -65 -4 -84 -33 -142 -39 -79 -128 -168 -219 -216 -68 -36 -212 -77 -225 -64 -5 5 -4 21 2 36 35 94 94 384 115 568 7 67 10 68 112 64 55 -2 85 -10 130 -32z"/><path d="M6415 5474 c4 -10 15 -51 23 -90 26 -126 7 -173 -155 -384 -127 -164 -123 -298 14 -432 l54 -53 -8 40 c-13 65 -8 158 11 209 10 26 52 89 92 139 41 51 89 121 107 156 27 56 31 75 31 140 0 59 -5 87 -22 122 -27 55 -80 119 -124 151 -29 20 -31 21 -23 2z"/><path d="M5972 5353 c5 -20 8 -69 6 -107 -4 -84 -23 -126 -108 -235 -142 -184 -148 -312 -21 -451 l41 -45 -7 40 c-24 124 3 208 110 342 36 45 73 104 84 130 24 64 24 175 -1 223 -23 44 -96 140 -106 140 -5 0 -4 -17 2 -37z"/><path d="M6805 5245 c31 -101 15 -164 -71 -287 -117 -165 -123 -255 -23 -360 l50 -53 -7 56 c-8 79 14 149 77 238 70 100 91 151 91 222 0 73 -26 129 -86 188 l-45 44 14 -48z"/></g></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [20, 20],
    popupAnchor: [0, -26],
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const zoom = L.control.zoom({ position: 'bottomright' })
    zoom.addTo(map)
    const zoomEl = zoom.getContainer()
    if (zoomEl) {
      zoomEl.style.marginBottom = '100px'
      zoomEl.style.marginRight = '12px'
    }

    const attrEl = (map as any).attributionControl.getContainer() as HTMLElement | undefined
    if (attrEl) {
      attrEl.style.marginBottom = '72px'
      attrEl.style.marginRight = '8px'
    }

    const circleStyle = { color: '#6b7280', weight: 1.5, dashArray: '6 6', fillOpacity: 0 }
    circle5Ref.current = L.circle([DEFAULT_LAT, DEFAULT_LNG], { radius: 400, ...circleStyle }).addTo(map)
    circle10Ref.current = L.circle([DEFAULT_LAT, DEFAULT_LNG], { radius: 800, ...circleStyle }).addTo(map)

    const labelStyle = 'background:transparent;border:none;box-shadow:none;font-size:11px;font-weight:600;color:#6b7280;white-space:nowrap;'
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
        <div className="absolute inset-0 bg-[#f6f6f6] flex items-center justify-center z-[1000]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#dadada] border-t-black rounded-full animate-spin" />
            <p className="text-[#5f5f5f] text-sm">Loading map…</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={flyToUser}
        className="absolute left-3 bottom-[76px] z-[1001] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#dadada] p-2.5 active:scale-95 transition-transform"
        title="Centre on location"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round">
          {/* outer ring */}
          <circle cx="12" cy="12" r="7" />
          {/* centre dot */}
          <circle cx="12" cy="12" r="2" fill="#0f0f0f" />
          {/* tick marks */}
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
        </svg>
      </button>
      {toast && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#0f0f0f] text-white text-xs px-4 py-2 rounded-full z-[2000] whitespace-nowrap pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
