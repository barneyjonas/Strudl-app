import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../store/appStore'
import StampSuccess from '../components/StampSuccess'

type ScanState = 'idle' | 'scanning' | 'success'

const MOCK_CAFES = ['The Corner Brew', 'Café Zentral', 'Kaffee Alt', 'Aida Café', 'Phil']

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function Scan() {
  const [state, setState] = useAppState()
  const navigate = useNavigate()
  const [scanState, setScanState] = useState<ScanState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (scanState === 'idle') {
      timerRef.current = setTimeout(() => triggerScan(), 2000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [scanState])

  const triggerScan = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setScanState('scanning')
    setTimeout(() => {
      const newStamps = state.stamps + 1
      const cafe = MOCK_CAFES[Math.floor(Math.random() * MOCK_CAFES.length)]
      const today = new Date().toISOString().split('T')[0]
      const newHistory = [
        { id: generateId(), cafe, city: 'Vienna', country: 'AUT', timeAgo: 'Just now', date: today },
        ...state.stampHistory,
      ]
      const existingCafe = state.favoriteCafes.find((c) => c.name === cafe)
      let updatedFavs = [...state.favoriteCafes]
      if (existingCafe) {
        updatedFavs = updatedFavs.map((c) =>
          c.name === cafe ? { ...c, visits: c.visits + 1 } : c
        )
      }
      setState({
        stamps: newStamps,
        lifetimeStamps: state.lifetimeStamps + 1,
        stampHistory: newHistory,
        favoriteCafes: updatedFavs,
      })
      setScanState('success')
    }, 800)
  }

  return (
    <div className="app-shell flex flex-col bg-[#1A1815]">
      {/* Header */}
      <div className="flex items-center px-5 pt-14 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-[#FDFAF5] font-semibold text-base ml-4">At the café?</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        {(scanState === 'idle' || scanState === 'scanning') && (
          <>
            <div className="relative mb-8">
              {/* QR viewfinder */}
              <div className={`w-72 h-72 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                scanState === 'scanning'
                  ? 'border-2 border-[#E6C828]'
                  : 'border border-white/10'
              }`} style={{ background: 'rgba(255,255,255,0.04)' }}>
                {scanState === 'scanning' ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#E6C828] border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/60 text-sm font-medium">Reading…</p>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm text-center leading-relaxed">
                    Point at café<br />QR code
                  </p>
                )}

                {/* Corner accents */}
                {scanState === 'idle' && (
                  <>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E6C828] rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E6C828] rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E6C828] rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E6C828] rounded-br-3xl" />
                  </>
                )}
              </div>
            </div>

            {scanState === 'idle' && (
              <>
                <p className="text-white/30 text-xs text-center mb-6">Scanning in a moment…</p>
                <button
                  onClick={triggerScan}
                  className="border border-white/15 text-white/60 font-medium text-sm py-3 px-8 rounded-full active:scale-95 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  Simulate scan
                </button>
              </>
            )}
          </>
        )}

        {scanState === 'success' && (
          <StampSuccess stamps={state.stamps} />
        )}
      </div>
    </div>
  )
}
