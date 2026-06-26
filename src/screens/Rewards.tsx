import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppState } from '../store/appStore'
import StampCard from '../components/StampCard'

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `STRDL-${part()}`
}

function SimpleQR() {
  const grid = Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => {
      if ((row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)) return true
      return (row * 3 + col * 7) % 4 === 0
    })
  )
  return (
    <div className="bg-[#FDFAF5] rounded-2xl p-4 inline-block border border-[#E8E2D8]">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {grid.flat().map((filled, i) => (
          <div key={i} className={`w-6 h-6 rounded-sm ${filled ? 'bg-[#1A1815]' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  )
}

export default function Rewards() {
  const [state, setState] = useAppState()
  const location = useLocation()
  const [view, setView] = useState<'normal' | 'redeem'>(
    location.state?.redeem ? 'redeem' : 'normal'
  )
  const [redeemCode] = useState(() => generateCode())
  const [showHistory, setShowHistory] = useState(false)

  const { stamps, pastRewards } = state
  const paid = 9
  const progress = (stamps / paid) * 100

  const handleMarkRedeemed = () => {
    const today = new Date().toISOString().split('T')[0]
    const newRecord = {
      id: `r${Date.now()}`,
      redeemedAt: today,
      cafe: state.favoriteCafes[0]?.name ?? 'Strudl Café',
      code: redeemCode,
    }
    setState({
      stamps: 0,
      lifetimeRewards: state.lifetimeRewards + 1,
      pastRewards: [newRecord, ...state.pastRewards],
    })
    setView('normal')
  }

  if (view === 'redeem') {
    return (
      <div className="app-shell overflow-y-auto">
        <div className="px-5 pt-14 pb-32">
          <button
            onClick={() => setView('normal')}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-8 bg-[#F0EBE0] border border-[#E8E2D8] active:scale-95 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#1A1815" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <h1 className="text-[#1A1815] font-bold text-2xl mb-1">Redeem reward</h1>
          <p className="text-[#7A7060] text-sm mb-8">Show this to your barista.</p>

          <div className="bg-[#FDFAF5] rounded-3xl p-6 flex flex-col items-center gap-6 border border-[#E8E2D8]"
            style={{ boxShadow: '0 4px 24px rgba(26,24,21,0.08)' }}>
            <div className="bg-[#F0EBE0] rounded-xl px-6 py-3 border border-[#E8E2D8]">
              <p className="text-[#1A1815] font-mono font-bold text-xl tracking-widest">{redeemCode}</p>
            </div>
            <SimpleQR />
            <div className="text-center">
              <p className="text-[#1A1815] font-semibold text-sm">1 × Free Coffee</p>
              <p className="text-[#7A7060] text-xs mt-1">Valid at any Strudl café</p>
            </div>
          </div>

          <p className="text-[#7A7060] text-xs text-center mt-5 mb-8 leading-relaxed">
            Show this to your barista.
          </p>

          <button
            onClick={handleMarkRedeemed}
            className="w-full bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-transform"
            style={{ boxShadow: '0 8px 24px rgba(26,24,21,0.22)' }}
          >
            Enjoy.
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-5 pt-14 pb-32">

        <h1 className="text-[#1A1815] font-bold text-2xl mb-1">Rewards</h1>
        <p className="text-[#7A7060] text-sm mb-8">Every coffee remembered.</p>

        {/* Stamp card */}
        <div className="mb-6">
          <StampCard stamps={stamps} />
        </div>

        {/* Progress or redeem */}
        {stamps >= paid ? (
          <div className="bg-[#E6C828] rounded-2xl p-5 mb-8 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-[#1A1815] font-bold text-xl">Free coffee unlocked</p>
              <p className="text-[#1A1815]/60 text-sm mt-1">Redeem at any Strudl café</p>
            </div>
            <button
              onClick={() => setView('redeem')}
              className="w-full bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-xl active:scale-[0.98] transition-transform"
            >
              Redeem now
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#7A7060] text-sm">
                <span className="text-[#1A1815] font-semibold">{paid - stamps}</span> more stamp{paid - stamps !== 1 ? 's' : ''} for a free coffee
              </p>
              <span className="text-[#7A7060] text-xs">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-[#E8E2D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A1815] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Past rewards */}
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between py-3 active:scale-[0.98] transition-transform"
          >
            <h2 className="text-[11px] font-semibold tracking-wide uppercase text-[#7A7060]">History</h2>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#7A7060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showHistory && (
            <div className="flex flex-col gap-2 mt-2">
              {pastRewards.length === 0 ? (
                <p className="text-[#7A7060] text-sm py-4 text-center">Nothing yet. Keep going.</p>
              ) : (
                pastRewards.map((r) => (
                  <div key={r.id}
                    className="bg-[#FDFAF5] rounded-2xl px-4 py-3.5 flex items-center justify-between border border-[#E8E2D8]">
                    <div>
                      <p className="text-[#1A1815] text-sm font-medium">{r.cafe}</p>
                      <p className="text-[#7A7060] text-xs mt-0.5">{r.redeemedAt}</p>
                    </div>
                    <span className="text-[#7A7060] font-mono text-xs">{r.code}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
