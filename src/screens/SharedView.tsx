import { lazy, Suspense, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { SharedPin } from '../components/SharedCafeMap'

const SharedCafeMap = lazy(() => import('../components/SharedCafeMap'))

const P = {
  bg: '#EDE8DF',
  shell: '#FDFAF5',
  surface: '#F0EBE0',
  border: '#E8E2D8',
  text: '#1A1815',
  muted: '#7A7060',
  subdued: '#C8BFB0',
}

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
    <div className="rounded-2xl flex items-center justify-center" style={{ height: 200, background: P.surface, border: `1px solid ${P.border}` }}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: P.border, borderTopColor: P.text }} />
        <p className="text-sm" style={{ color: P.muted }}>Loading map…</p>
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
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: P.bg }}>
        <div className="text-center max-w-xs">
          <div className="text-5xl mb-5">🤔</div>
          <h1 className="text-xl font-black mb-2" style={{ letterSpacing: '-0.03em', color: P.text }}>
            This link looks broken
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: P.muted }}>
            Ask your friend to share it again from their Strudl app.
          </p>
          <a
            href="https://strudl.app"
            className="mt-6 inline-block text-sm font-semibold"
            style={{ color: '#8A6800' }}
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
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="max-w-[430px] mx-auto min-h-screen flex flex-col" style={{ background: P.shell }}>

        {/* Header */}
        <div className="px-5 pt-10 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <span className="font-black text-xl" style={{ letterSpacing: '-0.04em', color: P.text }}>Strudl</span>
          <div className="mt-5">
            <h1 className="text-2xl font-black leading-tight" style={{ letterSpacing: '-0.03em', color: P.text }}>
              {firstName} shared{' '}
              {cafeCount} café{cafeCount !== 1 ? 's' : ''} with you{cityLabel} ☕
            </h1>
            {payload.n && (
              <p className="text-sm mt-3 italic leading-relaxed" style={{ color: P.muted }}>
                "{payload.n}"
              </p>
            )}
          </div>
        </div>

        {/* Map */}
        {mappablePins.length > 0 && (
          <div className="px-5 pt-5">
            <Suspense fallback={<MapSkeleton />}>
              <SharedCafeMap pins={mappablePins} height="210px" />
            </Suspense>
          </div>
        )}

        {/* Café list */}
        <div className="px-5 pt-5 pb-6 flex-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: P.muted }}>
            {cafeCount} café{cafeCount !== 1 ? 's' : ''}
          </h2>
          <div className="flex flex-col gap-3">
            {payload.c.map((cafe, i) => (
              <div
                key={cafe.id || i}
                className="rounded-2xl p-4 flex items-start gap-4"
                style={{ background: P.shell, border: `1px solid ${P.border}` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: P.surface }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={P.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                    <path d="M20 8h1a4 4 0 010 8h-1" />
                    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
                    <line x1="8" y1="1" x2="8" y2="4" />
                    <line x1="12" y1="1" x2="12" y2="4" />
                    <line x1="16" y1="1" x2="16" y2="4" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight truncate" style={{ color: P.text }}>{cafe.nm}</p>
                  <p className="text-xs mt-0.5" style={{ color: P.muted }}>{cafe.cy} · {cafe.co}</p>
                  {cafe.ad && (
                    <p className="text-xs mt-0.5 leading-tight" style={{ color: P.subdued }}>{cafe.ad}</p>
                  )}
                </div>

                {typeof cafe.la === 'number' && typeof cafe.lo === 'number' && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cafe.la},${cafe.lo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-semibold active:scale-95 transition-transform"
                    style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.text }}
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
          <div className="rounded-2xl p-5 text-center" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <p className="font-black text-base mb-1" style={{ letterSpacing: '-0.02em', color: P.text }}>
              Discover more loyal café spots
            </p>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: P.muted }}>
              Collect stamps, earn free coffees, explore the city.
            </p>
            <a
              href="https://strudl.app"
              className="inline-block font-bold text-sm py-3 px-8 rounded-full active:scale-95 transition-transform"
              style={{ background: P.text, color: P.shell, boxShadow: '0 8px 24px rgba(26,24,21,0.18)' }}
            >
              Get Strudl
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
