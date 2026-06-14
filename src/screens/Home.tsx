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

const CafeIcon = ({ stroke = '#0f0f0f' }: { stroke?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
    <path d="M20 8h1a4 4 0 010 8h-1" />
    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
    <line x1="8" y1="1" x2="8" y2="4" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="16" y1="1" x2="16" y2="4" />
  </svg>
)

export default function Home() {
  const [state, setState] = useAppState()
  const navigate = useNavigate()
  const { favoriteCafes, savedCafes, stamps } = state

  const savedWithDist = [...savedCafes]
    .map(cafe => ({ ...cafe, distKm: getDistanceKm(cafe.lat, cafe.lng) }))
    .sort((a, b) => a.distKm - b.distKm)

  const handleUnsave = (cafeId: string) => {
    setState({ savedCafes: savedCafes.filter(c => c.id !== cafeId) })
  }

  const isEmpty = favoriteCafes.length === 0 && savedCafes.length === 0

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-4 pt-12 pb-28">

        <h1 className="text-2xl font-black text-[#0f0f0f] mb-6" style={{ letterSpacing: '-0.03em' }}>
          Cafés
        </h1>

        {/* Stamp card */}
        <div className="mb-6">
          <StampCard stamps={stamps} />
        </div>

        {/* Scan CTA */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-black text-white font-bold text-base py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.18)] border border-black flex items-center justify-center gap-2 mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z" />
          </svg>
          Scan to collect stamp
        </button>

        {/* Empty state */}
        {isEmpty && (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#f6f6f6] border border-[#dadada] flex items-center justify-center">
              <CafeIcon stroke="#dadada" />
            </div>
            <div>
              <p className="text-[#5f5f5f] text-sm font-medium">No cafés yet</p>
              <p className="text-[#9ca3af] text-xs mt-1">Discover cafés on the map and scan to collect stamps</p>
            </div>
          </div>
        )}

        {/* Your cafés */}
        {favoriteCafes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[#0f0f0f] font-bold text-base mb-3" style={{ letterSpacing: '-0.01em' }}>Your cafés</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {favoriteCafes.map((cafe) => (
                <div key={cafe.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex flex-col gap-2 min-w-[140px] flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#ededed] flex items-center justify-center">
                    <CafeIcon />
                  </div>
                  <p className="text-[#0f0f0f] font-semibold text-sm leading-tight">{cafe.name}</p>
                  {cafe.label && <p className="text-black text-xs font-medium">{cafe.label}</p>}
                  <p className="text-[#5f5f5f] text-xs">{cafe.visits} visit{cafe.visits !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved cafés */}
        {savedWithDist.length > 0 && (
          <div>
            <h2 className="text-[#0f0f0f] font-bold text-base mb-3" style={{ letterSpacing: '-0.01em' }}>Saved</h2>
            <div className="flex flex-col gap-3">
              {savedWithDist.map((cafe) => (
                <div key={cafe.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                    <CafeIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0f0f0f] font-semibold text-sm leading-tight truncate">{cafe.name}</p>
                    <p className="text-[#5f5f5f] text-xs mt-0.5">{formatDist(cafe.distKm)} away</p>
                  </div>
                  <button
                    onClick={() => handleUnsave(cafe.id)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#E6C828] border border-[#F8EFBD] active:scale-95 transition-transform"
                    title="Remove from saved"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
