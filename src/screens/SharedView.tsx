import { lazy, Suspense, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { SharedPin } from '../components/SharedCafeMap'

const SharedCafeMap = lazy(() => import('../components/SharedCafeMap'))

interface ShareCafe {
  id: string
  nm: string
  cy: string
  co: string
  la?: number
  lo?: number
  ad?: string
}

interface SharePayload {
  v: 1
  f: string
  n?: string
  ci?: string
  c: ShareCafe[]
}

function decodeShareData(encoded: string): SharePayload | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as SharePayload
  } catch {
    return null
  }
}

function MapSkeleton() {
  return (
    <div className="rounded-2xl border border-[#dadada] bg-[#f6f6f6] flex items-center justify-center" style={{ height: 200 }}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#dadada] border-t-black rounded-full animate-spin" />
        <p className="text-[#5f5f5f] text-sm">Loading map…</p>
      </div>
    </div>
  )
}

export default function SharedView() {
  const location = useLocation()

  const payload = useMemo((): SharePayload | null => {
    const match = location.hash.match(/[#&]data=([^&]+)/)
    if (!match) return null
    return decodeShareData(match[1])
  }, [location.hash])

  if (!payload || payload.v !== 1 || !Array.isArray(payload.c)) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="text-5xl mb-5">🤔</div>
          <h1 className="text-xl font-black text-[#0f0f0f] mb-2" style={{ letterSpacing: '-0.03em' }}>
            This link looks broken
          </h1>
          <p className="text-[#5f5f5f] text-sm leading-relaxed">
            Ask your friend to share it again from their Strudl app.
          </p>
          <a
            href="https://strudl.app"
            className="mt-6 inline-block text-sm font-semibold text-[#D97706]"
          >
            Visit Strudl →
          </a>
        </div>
      </div>
    )
  }

  const cafeCount = payload.c.length
  const cityLabel = payload.ci ? ` in ${payload.ci}` : ''
  const firstName = payload.f || 'Someone'

  const mappablePins = useMemo((): SharedPin[] =>
    payload.c
      .filter((c): c is ShareCafe & { la: number; lo: number } => typeof c.la === 'number' && typeof c.lo === 'number')
      .map(c => ({ id: c.id, name: c.nm, lat: c.la, lng: c.lo, address: c.ad })),
    [payload.c]
  )

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="max-w-[430px] mx-auto bg-white min-h-screen flex flex-col">

        {/* Header */}
        <div className="px-5 pt-10 pb-6 border-b border-[#f0f0f0]">
          <span className="text-black font-black text-xl" style={{ letterSpacing: '-0.04em' }}>Strudl</span>
          <div className="mt-5">
            <h1 className="text-2xl font-black text-[#0f0f0f] leading-tight" style={{ letterSpacing: '-0.03em' }}>
              {firstName} shared{' '}
              {cafeCount} café{cafeCount !== 1 ? 's' : ''} with you{cityLabel} ☕
            </h1>
            {payload.n && (
              <p className="text-[#5f5f5f] text-sm mt-3 italic leading-relaxed">
                "{payload.n}"
              </p>
            )}
          </div>
        </div>

        {/* Map — only rendered when there are mappable cafes */}
        {mappablePins.length > 0 && (
          <div className="px-5 pt-5">
            <Suspense fallback={<MapSkeleton />}>
              <SharedCafeMap pins={mappablePins} height="210px" />
            </Suspense>
          </div>
        )}

        {/* Café list */}
        <div className="px-5 pt-5 pb-6 flex-1">
          <h2 className="text-sm font-semibold text-[#5f5f5f] uppercase tracking-wide mb-3">
            {cafeCount} café{cafeCount !== 1 ? 's' : ''}
          </h2>
          <div className="flex flex-col gap-3">
            {payload.c.map((cafe, i) => (
              <div
                key={cafe.id || i}
                className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-start gap-4"
              >
                {/* Café icon */}
                <div className="w-10 h-10 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                    <path d="M20 8h1a4 4 0 010 8h-1" />
                    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                    <line x1="8" y1="1" x2="8" y2="4" />
                    <line x1="12" y1="1" x2="12" y2="4" />
                    <line x1="16" y1="1" x2="16" y2="4" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0f0f0f] leading-tight truncate">{cafe.nm}</p>
                  <p className="text-xs text-[#5f5f5f] mt-0.5">{cafe.cy} · {cafe.co}</p>
                  {cafe.ad && (
                    <p className="text-xs text-[#9ca3af] mt-0.5 leading-tight">{cafe.ad}</p>
                  )}
                </div>

                {/* Directions — only if coordinates available */}
                {typeof cafe.la === 'number' && typeof cafe.lo === 'number' && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cafe.la},${cafe.lo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-white border border-[#dadada] rounded-xl px-3 py-2 text-xs font-semibold text-[#0f0f0f] active:scale-95 transition-transform"
                  >
                    Directions
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-12 pt-2">
          <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-5 text-center">
            <p className="text-[#0f0f0f] font-black text-base mb-1" style={{ letterSpacing: '-0.02em' }}>
              Discover more loyal café spots
            </p>
            <p className="text-[#5f5f5f] text-sm mb-4 leading-relaxed">
              Collect stamps, earn free coffees, explore the city.
            </p>
            <a
              href="https://strudl.app"
              className="inline-block bg-black text-white font-bold text-sm py-3 px-8 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.14)] active:scale-95 transition-transform"
            >
              Get Strudl
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
