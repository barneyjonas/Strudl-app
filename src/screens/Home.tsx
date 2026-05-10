import { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../store/appStore'
import StampCard from '../components/StampCard'
import { VIENNA_CAFES } from '../data/viennaCafes'

const CafeMap = lazy(() => import('../components/CafeMap'))

function MapSkeleton() {
  return (
    <div
      className="rounded-2xl border border-[#dadada] bg-[#f6f6f6] flex items-center justify-center"
      style={{ height: '280px' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#dadada] border-t-black rounded-full animate-spin" />
        <p className="text-[#5f5f5f] text-sm">Loading map…</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [state, setState] = useAppState()
  const navigate = useNavigate()
  const { stamps, favoriteCafes, savedCafes, user } = state
  const remaining = 9 - stamps

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
    <div className="app-shell overflow-y-auto">
      <div className="px-4 pt-12 pb-28">

        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0f0f0f]" style={{ letterSpacing: '-0.03em' }}>
            Hi {user.name} ☕
          </h1>
          <span className="text-black font-black text-base" style={{ letterSpacing: '-0.03em' }}>Strudl</span>
        </div>

        {/* Stamp card */}
        <div className="mb-2">
          <StampCard stamps={stamps} />
        </div>

        {stamps >= 9 ? (
          <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-5 mb-6 flex flex-col items-center gap-4">
            <span className="text-4xl">🎉</span>
            <div className="text-center">
              <p className="text-[#0f0f0f] font-black text-xl" style={{ letterSpacing: '-0.02em' }}>Free coffee unlocked!</p>
              <p className="text-[#5f5f5f] text-sm mt-1">Redeem at any Strudl café</p>
            </div>
            <button
              onClick={() => navigate('/rewards', { state: { redeem: true } })}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.14)] border border-black"
            >
              Redeem now
            </button>
          </div>
        ) : (
          <p className="text-center text-sm mb-6">
            {stamps === 0 ? (
              <span className="text-[#5f5f5f]">Collect 9 stamps. The 10th is free.</span>
            ) : remaining === 1 ? (
              <span className="text-[#0f0f0f] font-semibold">1 more stamp and your coffee is on us ☕</span>
            ) : (
              <span className="text-[#0f0f0f] font-medium">
                <span className="font-black">{remaining}</span> stamps until your free coffee 🎉
              </span>
            )}
          </p>
        )}

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

        {/* Café map */}
        <h2 className="text-[#0f0f0f] font-bold text-base mb-3" style={{ letterSpacing: '-0.01em' }}>Strudl cafés near you</h2>
        <div className="mb-8">
          <Suspense fallback={<MapSkeleton />}>
            <CafeMap
              loyalCafeNames={favoriteCafes.map(c => c.name)}
              savedCafeIds={savedCafes.map(c => c.id)}
              onSaveToggle={handleSaveToggle}
              height="280px"
            />
          </Suspense>
        </div>

        {/* Your cafés */}
        <h2 className="text-[#0f0f0f] font-bold text-base mb-3" style={{ letterSpacing: '-0.01em' }}>Your cafés</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {favoriteCafes.map((cafe) => (
            <div key={cafe.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex flex-col gap-2 min-w-[140px] flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#ededed] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                  <path d="M20 8h1a4 4 0 010 8h-1" />
                  <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                  <line x1="8" y1="1" x2="8" y2="4" />
                  <line x1="12" y1="1" x2="12" y2="4" />
                  <line x1="16" y1="1" x2="16" y2="4" />
                </svg>
              </div>
              <p className="text-[#0f0f0f] font-semibold text-sm leading-tight">{cafe.name}</p>
              {cafe.label && <p className="text-black text-xs font-medium">{cafe.label}</p>}
              <p className="text-[#5f5f5f] text-xs">{cafe.visits} visits</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
