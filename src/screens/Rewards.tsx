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
    <div className="bg-[#f6f6f6] border border-[#dadada] p-4 rounded-2xl inline-block">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {grid.flat().map((filled, i) => (
          <div key={i} className={`w-6 h-6 rounded-sm ${filled ? 'bg-black' : 'bg-[#f6f6f6]'}`} />
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
  const progress = (stamps / 9) * 100

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
        <div className="px-4 pt-12 pb-28">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setView('normal')}
              className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-[#dadada] flex items-center justify-center active:scale-95 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <h1 className="text-[#0f0f0f] font-black text-xl tracking-tight" style={{ letterSpacing: '-0.02em' }}>Redeem reward</h1>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-6 w-full flex flex-col items-center gap-5">
              <div className="bg-[#ededed] border border-[#dadada] rounded-xl px-6 py-3">
                <p className="text-[#0f0f0f] font-mono font-bold text-xl tracking-widest">{redeemCode}</p>
              </div>
              <SimpleQR />
              <div className="text-center">
                <p className="text-[#0f0f0f] font-semibold text-sm">1 × Free Coffee</p>
                <p className="text-[#5f5f5f] text-xs mt-1">Valid at any Strudl café</p>
              </div>
            </div>

            <p className="text-[#5f5f5f] text-xs text-center">
              Show this code to your barista. They'll scan it to redeem your reward.
            </p>

            <button
              onClick={handleMarkRedeemed}
              className="w-full bg-black text-white font-bold text-base py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.14)] border border-black"
            >
              Mark as redeemed
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-4 pt-12 pb-28">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0f0f0f] tracking-tight" style={{ letterSpacing: '-0.03em' }}>Rewards</h1>
          <p className="text-[#5f5f5f] text-sm mt-0.5">Collect anywhere. Redeem anywhere.</p>
        </div>

        {/* Progress display */}
        <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-5 mb-4">
          <div className="flex items-end gap-1 mb-4">
            <span className="text-[#0f0f0f] font-black text-5xl" style={{ letterSpacing: '-0.04em' }}>{stamps}</span>
            <span className="text-[#5f5f5f] font-bold text-2xl mb-1.5">/ 9</span>
          </div>
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
              onClick={() => setView('redeem')}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.14)] border border-black"
            >
              Redeem now
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#5f5f5f] text-sm">
                <span className="text-[#0f0f0f] font-semibold">{9 - stamps}</span> more stamp{9 - stamps !== 1 ? 's' : ''} until your free coffee
              </p>
            </div>
            <div className="h-1.5 bg-[#ededed] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Past rewards */}
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between py-3 active:scale-95 transition-transform"
          >
            <h2 className="text-[#0f0f0f] font-bold text-base" style={{ letterSpacing: '-0.01em' }}>Past rewards</h2>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#5f5f5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {(showHistory || pastRewards.length > 0) && (
            <div className="flex flex-col gap-2">
              {pastRewards.length === 0 ? (
                <p className="text-[#5f5f5f] text-sm py-4 text-center">No rewards redeemed yet</p>
              ) : (
                pastRewards.map((r) => (
                  <div key={r.id} className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[#0f0f0f] text-sm font-medium">{r.cafe}</p>
                      <p className="text-[#5f5f5f] text-xs">{r.redeemedAt}</p>
                    </div>
                    <span className="text-[#5f5f5f] font-mono text-xs">{r.code}</span>
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
