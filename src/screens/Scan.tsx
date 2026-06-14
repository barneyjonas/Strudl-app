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
      timerRef.current = setTimeout(() => {
        triggerScan()
      }, 2000)
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
    <div className="app-shell flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-14 pb-4 border-b border-[#dadada]">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-[#dadada] flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-[#0f0f0f] font-bold text-lg ml-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>Scan QR Code</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        {(scanState === 'idle' || scanState === 'scanning') && (
          <>
            <div className="relative mb-8">
              <div
                className={`w-72 h-72 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  scanState === 'scanning'
                    ? 'border-black bg-[#f6f6f6]'
                    : 'border-[#dadada] bg-[#f6f6f6]'
                }`}
              >
                {scanState === 'scanning' ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#0f0f0f] text-sm font-medium">Scanning...</p>
                  </div>
                ) : (
                  <p className="text-[#5f5f5f] text-sm text-center leading-relaxed px-4">
                    Point at café<br />QR code
                  </p>
                )}

                {/* Corner accents */}
                {scanState === 'idle' && (
                  <>
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-black rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-black rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black rounded-br-xl" />
                  </>
                )}
              </div>
            </div>

            <p className="text-[#5f5f5f] text-sm text-center mb-8">
              {scanState === 'idle' ? 'Auto-scanning in 2 seconds…' : ''}
            </p>

            {scanState === 'idle' && (
              <button
                onClick={triggerScan}
                className="bg-[#f6f6f6] border border-[#dadada] text-[#0f0f0f] font-semibold text-sm py-3.5 px-8 rounded-full active:scale-95 transition-transform"
              >
                Simulate scan
              </button>
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
