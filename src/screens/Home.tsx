import { useNavigate } from 'react-router-dom'
import { useAppState } from '../store/appStore'
import StampCard from '../components/StampCard'

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

function formatDist(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export default function Home() {
  const [state, setState] = useAppState()
  const navigate = useNavigate()
  const { favoriteCafes, savedCafes, stamps, user } = state

  const savedWithDist = [...savedCafes]
    .map(cafe => ({ ...cafe, distKm: getDistanceKm(cafe.lat, cafe.lng) }))
    .sort((a, b) => a.distKm - b.distKm)

  const handleUnsave = (cafeId: string) => {
    setState({ savedCafes: savedCafes.filter(c => c.id !== cafeId) })
  }

  const firstName = user.name.split(' ')[0]

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-5 pt-14 pb-32">

        {/* Greeting */}
        <p className="text-[#1A1815] font-medium text-base mb-5">Good to see you, {firstName}.</p>

        {/* Hero stamp card */}
        <div className="mb-6">
          <StampCard stamps={stamps} />
        </div>

        {/* Scan CTA */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full flex items-center justify-center gap-2.5 bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-transform mb-10"
          style={{ boxShadow: '0 8px 24px rgba(26,24,21,0.22)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z" />
          </svg>
          Scan
        </button>

        {/* Your cafés */}
        {favoriteCafes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[11px] font-semibold tracking-wide uppercase text-[#7A7060] mb-4">Your regulars</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
              {favoriteCafes.map((cafe) => (
                <div key={cafe.id}
                  className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-2 min-w-[148px] flex-shrink-0 border border-[#E8E2D8]"
                  style={{ boxShadow: '0 2px 12px rgba(26,24,21,0.06)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: '#F0EBE0' }}>
                    <svg width="18" height="18" viewBox="0 -2 24 26" fill="none"
                      stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 8h1a4 4 0 010 8h-1" />
                      <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                      <line x1="8" y1="1" x2="8" y2="4" />
                      <line x1="12" y1="1" x2="12" y2="4" />
                      <line x1="16" y1="1" x2="16" y2="4" />
                    </svg>
                  </div>
                  <p className="text-[#1A1815] font-semibold text-sm leading-tight">{cafe.name}</p>
                  {cafe.label && (
                    <p className="text-[#E6C828] text-[10px] font-semibold">{cafe.label}</p>
                  )}
                  <p className="text-[#7A7060] text-xs">{cafe.visits} visit{cafe.visits !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved cafés */}
        {savedWithDist.length > 0 && (
          <div>
            <h2 className="text-[11px] font-semibold tracking-wide uppercase text-[#7A7060] mb-4">Places to try</h2>
            <div className="flex flex-col gap-2">
              {savedWithDist.map((cafe) => (
                <div key={cafe.id}
                  className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 border border-[#E8E2D8]"
                  style={{ boxShadow: '0 1px 8px rgba(26,24,21,0.05)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F0EBE0' }}>
                    <svg width="18" height="18" viewBox="0 -2 24 26" fill="none"
                      stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 8h1a4 4 0 010 8h-1" />
                      <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                      <line x1="8" y1="1" x2="8" y2="4" />
                      <line x1="12" y1="1" x2="12" y2="4" />
                      <line x1="16" y1="1" x2="16" y2="4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1815] font-semibold text-sm leading-tight truncate">{cafe.name}</p>
                    <p className="text-[#7A7060] text-xs mt-0.5">{formatDist(cafe.distKm)} away</p>
                  </div>
                  <button
                    onClick={() => handleUnsave(cafe.id)}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#E6C828] active:scale-95 transition-transform"
                    title="Remove from saved"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24"
                      fill="#1A1815" stroke="#1A1815" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {favoriteCafes.length === 0 && savedCafes.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#F0EBE0', border: '1px solid #E8E2D8' }}>
              <svg width="22" height="22" viewBox="0 -2 24 26" fill="none"
                stroke="#C8BFB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 8h1a4 4 0 010 8h-1" />
                <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                <line x1="8" y1="1" x2="8" y2="4" />
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="16" y1="1" x2="16" y2="4" />
              </svg>
            </div>
            <div>
              <p className="text-[#1A1815] text-sm font-medium">Your first café is out there.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
