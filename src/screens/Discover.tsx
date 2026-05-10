import { useState, useRef } from 'react'
import { useAppState } from '../store/appStore'
import ShareModal from '../components/ShareModal'

const USER_LAT = 48.2082
const USER_LNG = 16.3738

function getDistanceKm(lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - USER_LAT) * Math.PI / 180
  const dLon = (lng2 - USER_LNG) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(USER_LAT * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDist(km: number): string {
  if (km >= 10) return `${Math.round(km)} km`
  return `${km.toFixed(1)} km`
}

type Tab = 'my' | 'saved'

export default function Discover() {
  const [state] = useAppState()
  const [tab, setTab] = useState<Tab>('my')
  const [showModal, setShowModal] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const savedWithDist = [...state.savedCafes]
    .map(cafe => ({ ...cafe, distKm: getDistanceKm(cafe.lat, cafe.lng) }))
    .sort((a, b) => a.distKm - b.distKm)

  const hasNoFavorites = state.favoriteCafes.length === 0

  const handleShareClick = () => {
    if (hasNoFavorites) {
      setShowTooltip(true)
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 3000)
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-4 pt-12 pb-28">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-black text-[#0f0f0f]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Discover
          </h1>

          {/* Share favorites button */}
          <div className="relative">
            <button
              onClick={handleShareClick}
              className={`flex items-center gap-1.5 border rounded-full px-3.5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                hasNoFavorites
                  ? 'border-[#dadada] text-[#9ca3af] bg-[#f6f6f6]'
                  : 'border-[#0f0f0f] text-[#0f0f0f] bg-white hover:bg-[#f6f6f6]'
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Share
            </button>

            {showTooltip && (
              <div className="absolute right-0 top-11 bg-[#0f0f0f] text-white text-xs px-3 py-2.5 rounded-xl z-50 w-56 text-center leading-relaxed">
                Visit some Strudl cafés first to build your favorites list
                <div
                  className="absolute -top-1.5 right-5 w-3 h-3 bg-[#0f0f0f] rotate-45"
                  style={{ borderRadius: '1px' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-1 mb-6">
          <button
            onClick={() => setTab('my')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              tab === 'my'
                ? 'bg-white text-[#0f0f0f] shadow-sm border border-[#dadada]'
                : 'text-[#5f5f5f]'
            }`}
          >
            My cafés
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              tab === 'saved'
                ? 'bg-white text-[#0f0f0f] shadow-sm border border-[#dadada]'
                : 'text-[#5f5f5f]'
            }`}
          >
            Saved cafés
          </button>
        </div>

        {/* My cafés */}
        {tab === 'my' && (
          <div className="flex flex-col gap-3">
            {state.favoriteCafes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5f5f5f] text-sm">No favourite cafés yet.</p>
                <p className="text-[#9ca3af] text-xs mt-1">Start collecting stamps!</p>
              </div>
            ) : (
              state.favoriteCafes.map((cafe) => (
                <div key={cafe.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                      <path d="M20 8h1a4 4 0 010 8h-1" />
                      <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                      <line x1="8" y1="1" x2="8" y2="4" />
                      <line x1="12" y1="1" x2="12" y2="4" />
                      <line x1="16" y1="1" x2="16" y2="4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0f0f0f] font-semibold text-sm leading-tight truncate">{cafe.name}</p>
                    {cafe.label && <p className="text-black text-xs font-medium">{cafe.label}</p>}
                    <p className="text-[#5f5f5f] text-xs">{cafe.city} · {cafe.country}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[#0f0f0f] font-black text-lg" style={{ letterSpacing: '-0.02em' }}>{cafe.visits}</span>
                    <span className="text-[#5f5f5f] text-xs">visits</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved cafés */}
        {tab === 'saved' && (
          <div className="flex flex-col gap-3">
            {savedWithDist.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dadada" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <div>
                  <p className="text-[#5f5f5f] text-sm font-medium">No saved cafés yet</p>
                  <p className="text-[#9ca3af] text-xs mt-1">Tap the bookmark icon on any café to save it here</p>
                </div>
              </div>
            ) : (
              savedWithDist.map((cafe) => (
                <div key={cafe.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                      <path d="M20 8h1a4 4 0 010 8h-1" />
                      <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                      <line x1="8" y1="1" x2="8" y2="4" />
                      <line x1="12" y1="1" x2="12" y2="4" />
                      <line x1="16" y1="1" x2="16" y2="4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0f0f0f] font-semibold text-sm leading-tight truncate">{cafe.name}</p>
                    <p className="text-[#5f5f5f] text-xs">{cafe.city} · {cafe.country}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[#0f0f0f] font-bold text-sm">{formatDist(cafe.distKm)}</span>
                    <span className="text-[#5f5f5f] text-xs">away</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ShareModal
        open={showModal}
        onClose={() => setShowModal(false)}
        favoriteCafes={state.favoriteCafes}
        userName={state.user.name}
      />
    </div>
  )
}
