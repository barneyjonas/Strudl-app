import React, { lazy, Suspense, useCallback, useState } from 'react'
import { useAppState } from '../store/appStore'
import { VIENNA_CAFES, type CafeAbout, type CafePin } from '../data/viennaCafes'

function dispatchSheetEvent(open: boolean) {
  window.dispatchEvent(new CustomEvent('strudl_sheet_open', { detail: { open } }))
}

function isOpenNow(openHours: string): boolean | null {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours() + now.getMinutes() / 60
  const dayMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }
  for (const segment of openHours.split(',').map(s => s.trim())) {
    const lastSpace = segment.lastIndexOf(' ')
    if (lastSpace === -1) continue
    const dayPart = segment.slice(0, lastSpace)
    const timeParts = segment.slice(lastSpace + 1).split('–')
    if (timeParts.length !== 2) continue
    const parseTime = (t: string) => { const [h, m] = t.split(':').map(Number); return h + (m || 0) / 60 }
    const openTime = parseTime(timeParts[0])
    const closeTime = parseTime(timeParts[1])
    let dayApplies = false
    if (dayPart === 'Daily') {
      dayApplies = true
    } else {
      const parts = dayPart.split('–')
      if (parts.length === 2) {
        const s = dayMap[parts[0].trim()], e = dayMap[parts[1].trim()]
        if (s !== undefined && e !== undefined)
          dayApplies = s <= e ? day >= s && day <= e : day >= s || day <= e
      } else {
        const d = dayMap[dayPart.trim()]
        dayApplies = d !== undefined && day === d
      }
    }
    if (dayApplies) return hour >= openTime && hour < closeTime
  }
  return null
}

const CafeMap = lazy(() => import('../components/CafeMap'))

const USER_LAT = 48.2082
const USER_LNG = 16.3738

function getDistanceKm(lat: number, lng: number): number {
  const R = 6371
  const dLat = (lat - USER_LAT) * Math.PI / 180
  const dLon = (lng - USER_LNG) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(USER_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getTravelTimes(km: number) {
  return {
    walk:    Math.max(1, Math.round(km * 13)),
    transit: Math.max(2, Math.round(km * 4 + 4)),
    car:     Math.max(1, Math.round(km * 2.5 + 2)),
  }
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= full ? '#E6C828' : 'none'}
          stroke={i <= full ? '#E6C828' : '#E8E2D8'}
          strokeWidth="1.5"
          strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

interface SheetProps {
  cafe: CafePin
  isSaved: boolean
  onSave: () => void
  onClose: () => void
}

const ABOUT_LABELS: { key: keyof CafeAbout; label: string }[] = [
  { key: 'accessibility',   label: 'Accessibility' },
  { key: 'serviceOptions',  label: 'Service options' },
  { key: 'highlights',      label: 'Highlights' },
  { key: 'popularFor',      label: 'Popular for' },
  { key: 'offerings',       label: 'Offerings' },
  { key: 'diningOptions',   label: 'Dining options' },
  { key: 'amenities',       label: 'Amenities' },
  { key: 'atmosphere',      label: 'Atmosphere' },
  { key: 'crowd',           label: 'Crowd' },
  { key: 'planning',        label: 'Planning' },
  { key: 'payments',        label: 'Payments' },
  { key: 'children',        label: 'Children' },
  { key: 'parking',         label: 'Parking' },
  { key: 'pets',            label: 'Pets' },
]

type FeatureIcon = { id: string; label: string; icon: React.ReactNode }

function getCafeFeatureIcons(cafe: CafePin): FeatureIcon[] {
  const a = cafe.about
  const all: (FeatureIcon | null)[] = [
    a.accessibility?.some(x => x.toLowerCase().includes('wheelchair')) ? {
      id: 'wheelchair',
      label: 'Accessible',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="1.5" />
          <path d="M9 9l3-1 3 4h3" />
          <path d="M9 9v6l3 3" />
          <path d="M12 15v-3" />
          <path d="M7 20a5 5 0 0 0 8.66-5" />
        </svg>
      ),
    } : null,
    a.amenities?.some(x => x.toLowerCase().includes('wi-fi')) ? {
      id: 'wifi',
      label: 'Wi-Fi',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      ),
    } : null,
    a.amenities?.some(x => x.toLowerCase().includes('toilet')) ? {
      id: 'toilet',
      label: 'Toilette',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 1 3 3v1H9V5a3 3 0 0 1 3-3z" />
          <path d="M5 6h14l-1 10a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4L5 6z" />
          <line x1="10" y1="14" x2="10" y2="11" />
          <line x1="14" y1="14" x2="14" y2="11" />
        </svg>
      ),
    } : null,
    a.payments?.some(x => x.toLowerCase().includes('nfc')) ? {
      id: 'nfc',
      label: 'NFC',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M10 9a3 3 0 0 1 0 6" />
          <path d="M13.5 7.5a6 6 0 0 1 0 9" />
        </svg>
      ),
    } : null,
    a.serviceOptions?.some(x => x.toLowerCase().includes('outdoor')) ? {
      id: 'outdoor',
      label: 'Outdoors',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    } : null,
    a.pets?.includes('Dogs allowed') ? {
      id: 'dogs',
      label: 'Dogs OK',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
          <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5" />
          <path d="M8 14v.5" /><path d="M16 14v.5" />
          <path d="M11.25 16.25h1.5L12 17l-.75-.75z" />
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
        </svg>
      ),
    } : null,
    a.offerings?.some(x => x.toLowerCase().includes('vegan')) ? {
      id: 'vegan',
      label: 'Vegan',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22c1.25-1.25 2.5-3.5 2.5-5 0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" />
          <path d="M12 22V11" />
          <path d="M12 11C12 5.5 17 3 22 3c0 5.5-3 9-10 9" />
        </svg>
      ),
    } : null,
  ]
  return all.filter(Boolean).slice(0, 5) as FeatureIcon[]
}

function NavChooser({ lat, lng, onClose }: { lat: number; lng: number; onClose: () => void }) {
  const apps = [
    {
      label: 'Google Maps',
      url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: 'Waze',
      url: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="7" />
          <path d="M9 10h.01M15 10h.01" strokeWidth="3" strokeLinecap="round" />
          <path d="M9.5 13.5s.8 1.5 2.5 1.5 2.5-1.5 2.5-1.5" />
          <path d="M8 19l-1 3M16 19l1 3" />
        </svg>
      ),
    },
    {
      label: 'Apple Maps',
      url: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 z-[3000] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-[430px] bg-[#FDFAF5] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.2)] pb-8 pt-4 px-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-[#E8E2D8] rounded-full" />
        </div>
        <p className="text-xs font-semibold text-[#7A7060] uppercase tracking-wider mb-3">Open directions in…</p>
        <div className="flex flex-col gap-2">
          {apps.map(app => (
            <a
              key={app.label}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E8E2D8] text-[#1A1815] font-semibold text-sm active:bg-[#F0EBE0] transition-colors"
            >
              {app.icon}
              {app.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function CafeBottomSheet({ cafe, isSaved, onSave, onClose }: SheetProps) {
  const [showAbout, setShowAbout] = useState(false)
  const [showNavChooser, setShowNavChooser] = useState(false)
  const distKm = getDistanceKm(cafe.lat, cafe.lng)
  const travel = getTravelTimes(distKm)
  const featureIcons = getCafeFeatureIcons(cafe)
  const openStatus = isOpenNow(cafe.openHours)
  const distLabel = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`

  return (
    <>
    <div className="absolute bottom-0 left-0 right-0 z-[2000] bg-[#FDFAF5] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] animate-slide-up max-h-[75vh] overflow-y-auto">
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-[#FDFAF5] z-10">
        <div className="w-10 h-1 bg-[#E8E2D8] rounded-full" />
      </div>

      <div className="px-5 pt-2 pb-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-[#F0EBE0] rounded-full active:scale-95 transition-transform"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Name — font-bold, no forced tracking */}
        <h2 className="text-xl font-bold text-[#1A1815] pr-10 mb-1">
          {cafe.name}
        </h2>

        {/* Key decision line: open/closed · distance · walk */}
        <div className="flex items-center gap-2 mb-2">
          {openStatus !== null && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${openStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {openStatus ? 'Open' : 'Closed'}
            </span>
          )}
          <span className="text-xs text-[#7A7060]">{distLabel}</span>
          <span className="text-[#E8E2D8] text-xs select-none">·</span>
          <span className="text-xs text-[#7A7060]">{travel.walk} min walk</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#1A1815] font-bold text-sm">{cafe.rating.toFixed(1)}</span>
          <StarRating rating={cafe.rating} />
          <span className="text-[#9ca3af] text-xs">{cafe.reviewCount.toLocaleString()} reviews</span>
        </div>

        {/* Actions — primary first, secondary below */}
        <div className="flex flex-col gap-2 mb-5">
          <button
            onClick={() => setShowNavChooser(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-3.5 rounded-full active:scale-95 transition-transform"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Directions
          </button>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-full active:scale-95 transition-all border ${
                isSaved ? 'bg-[#E6C828] border-[#E6C828] text-[#1A1815]' : 'border-[#E8E2D8] text-[#1A1815]'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={isSaved ? '#000' : 'none'} stroke={isSaved ? '#000' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => setShowAbout(v => !v)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm py-3 rounded-full active:scale-95 transition-all ${
                showAbout ? 'font-semibold text-[#1A1815]' : 'font-medium text-[#7A7060]'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              About
            </button>
          </div>
        </div>

        <div className="h-px bg-[#f0f0f0] mb-4" />

        {/* Feature icons — icons only, no labels */}
        {featureIcons.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            {featureIcons.map(f => (
              <div key={f.id} className="w-5 h-5 flex items-center justify-center text-[#7A7060]" title={f.label}>
                {f.icon}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cafe.tags.map(tag => (
            <span key={tag} className="text-xs bg-[#F0EBE0] border border-[#E8E2D8] text-[#1A1815] px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm text-[#1A1815] leading-snug">{cafe.address}</span>
          </div>
          <div className="flex items-start gap-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm text-[#7A7060] leading-snug">{cafe.openHours}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4" r="1.5" fill="#9ca3af" stroke="none" />
                <path d="M9 12l2-4 3 2 2 4" /><path d="M9 20l1-4" /><path d="M15 20l-1.5-4" />
              </svg>
              <span className="text-sm text-[#1A1815]">{travel.walk} min</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="13" rx="2" />
                <path d="M8 19l-2 3M16 19l2 3M4 11h16" />
                <circle cx="8.5" cy="15.5" r="1" fill="#9ca3af" stroke="none" />
                <circle cx="15.5" cy="15.5" r="1" fill="#9ca3af" stroke="none" />
              </svg>
              <span className="text-sm text-[#1A1815]">{travel.transit} min</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 01-2-2V9l3-4h14l3 4v6a2 2 0 01-2 2h-2" />
                <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" />
              </svg>
              <span className="text-sm text-[#1A1815]">{travel.car} min</span>
            </div>
          </div>
        </div>

        {/* About section */}
        {showAbout && (
          <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-[#f0f0f0]">
            {ABOUT_LABELS.map(({ key, label }) => {
              const items = cafe.about[key]
              if (!items || items.length === 0) return null
              return (
                <div key={key}>
                  <p className="text-[#7A7060] text-[11px] font-semibold uppercase tracking-wider mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <span key={item} className="text-xs bg-[#F0EBE0] border border-[#E8E2D8] text-[#1A1815] px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>

    {showNavChooser && (
      <NavChooser lat={cafe.lat} lng={cafe.lng} onClose={() => setShowNavChooser(false)} />
    )}
    </>
  )
}

export default function Discover() {
  const [state, setState] = useAppState()
  const [selectedCafe, setSelectedCafe] = useState<CafePin | null>(null)
  const { favoriteCafes, savedCafes } = state

  const selectCafe = useCallback((cafe: CafePin) => {
    setSelectedCafe(cafe)
    dispatchSheetEvent(true)
  }, [])

  const deselectCafe = useCallback(() => {
    setSelectedCafe(null)
    dispatchSheetEvent(false)
  }, [])

  const handleSaveToggle = (cafeId: string) => {
    const isSaved = savedCafes.some(c => c.id === cafeId)
    if (isSaved) {
      setState({ savedCafes: savedCafes.filter(c => c.id !== cafeId) })
    } else {
      const cafe = VIENNA_CAFES.find(c => c.id === cafeId)
      if (!cafe) return
      setState({
        savedCafes: [...savedCafes, {
          id: cafe.id,
          name: cafe.name,
          lat: cafe.lat,
          lng: cafe.lng,
          city: 'Vienna',
          country: 'AUT',
        }],
      })
    }
  }

  return (
    <div className="app-shell">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center z-[1000]" style={{ background: '#1A1815' }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#E6C828] rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Opening map…</p>
          </div>
        </div>
      }>
        <CafeMap
          loyalCafeNames={favoriteCafes.map(c => c.name)}
          savedCafeIds={savedCafes.map(c => c.id)}
          onSaveToggle={handleSaveToggle}
          onCafeSelect={selectCafe}
          onMapClick={deselectCafe}
          fullScreen
        />
      </Suspense>

      {selectedCafe && (
        <CafeBottomSheet
          cafe={selectedCafe}
          isSaved={savedCafes.some(c => c.id === selectedCafe.id)}
          onSave={() => handleSaveToggle(selectedCafe.id)}
          onClose={deselectCafe}
        />
      )}
    </div>
  )
}
