import { useState, useEffect, useMemo, useRef } from 'react'
import { VIENNA_CAFES } from '../data/viennaCafes'
import type { FavoriteCafe } from '../types'

interface ShareCafe {
  id: string
  nm: string
  cy: string
  co: string
  la?: number
  lo?: number
  ad?: string
}

export interface SharePayload {
  v: 1
  f: string
  n?: string
  ci?: string
  c: ShareCafe[]
}

function encodeShareData(payload: SharePayload): string {
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

function buildShareUrl(payload: SharePayload): string {
  return `${window.location.origin}/shared/v1#data=${encodeShareData(payload)}`
}

function buildShareText(payload: SharePayload, url: string): string {
  const count = payload.c.length
  const cityPart = payload.ci ? ` in ${payload.ci}` : ''
  const header = `${payload.f} shared ${count} favourite Strudl café${count !== 1 ? 's' : ''}${cityPart} with you! ☕`
  const notePart = payload.n ? `\n"${payload.n}"\n` : ''
  const list = payload.c.map(c => `☕ ${c.nm} — ${c.cy}`).join('\n')
  return `${header}${notePart}\n${list}\n\nView the full list: ${url}`
}

interface Props {
  open: boolean
  onClose: () => void
  favoriteCafes: FavoriteCafe[]
  userName: string
}

export default function ShareModal({ open, onClose, favoriteCafes, userName }: Props) {
  const [shareType, setShareType] = useState<'all' | 'city'>('all')
  const [selectedCity, setSelectedCity] = useState('')
  const [note, setNote] = useState('')
  const [noteEdited, setNoteEdited] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const firstName = userName.split(' ')[0]

  const cities = useMemo(() => {
    const counts = new Map<string, { city: string; country: string; count: number }>()
    favoriteCafes.forEach(c => {
      const key = c.city
      const entry = counts.get(key)
      if (entry) entry.count++
      else counts.set(key, { city: c.city, country: c.country, count: 1 })
    })
    return [...counts.values()].sort((a, b) => b.count - a.count)
  }, [favoriteCafes])

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0].city)
    }
  }, [cities, selectedCity])

  const defaultNote = useMemo(() => {
    if (shareType === 'city' && selectedCity) {
      return `Hey! Here are my favorite Strudl cafés in ${selectedCity} ☕`
    }
    return `Hey! Here are my favorite Strudl cafés ☕`
  }, [shareType, selectedCity])

  useEffect(() => {
    if (!noteEdited) setNote(defaultNote)
  }, [defaultNote, noteEdited])

  useEffect(() => {
    if (open) {
      setShareType('all')
      setNoteEdited(false)
      setCopied(false)
    }
  }, [open])

  const filteredCafes = useMemo(() => {
    if (shareType === 'all') return favoriteCafes
    return favoriteCafes.filter(c => c.city === selectedCity)
  }, [favoriteCafes, shareType, selectedCity])

  const payload: SharePayload = useMemo(() => ({
    v: 1,
    f: firstName,
    n: note.trim() || undefined,
    ci: shareType === 'city' ? selectedCity : undefined,
    c: filteredCafes.map(cafe => {
      const pin = VIENNA_CAFES.find(p => p.name === cafe.name)
      return {
        id: cafe.id,
        nm: cafe.name,
        cy: cafe.city,
        co: cafe.country,
        ...(pin ? { la: pin.lat, lo: pin.lng, ad: pin.address } : {}),
      }
    }),
  }), [firstName, note, shareType, selectedCity, filteredCafes])

  const shareUrl = buildShareUrl(payload)
  const shareText = buildShareText(payload, shareUrl)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener')
  }

  const handleSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`
  }

  const handleEmail = () => {
    const subject = `${firstName} shared ${filteredCafes.length} Strudl café${filteredCafes.length !== 1 ? 's' : ''} with you`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Strudl cafés', text: shareText, url: shareUrl })
      } catch {
        // user cancelled
      }
    } else {
      handleCopy()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[2000] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto bg-black/50' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[2001] bg-[#FDFAF5] rounded-t-3xl max-h-[92svh] overflow-y-auto transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#E8E2D8]" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-black text-[#1A1815]" style={{ letterSpacing: '-0.03em' }}>
              Share your favorite cafés
            </h2>
            <p className="text-[#7A7060] text-sm mt-1 leading-relaxed">
              Send your top spots to a friend — they don't need Strudl to view the list.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EBE0] flex items-center justify-center flex-shrink-0 mt-0.5 active:scale-95 transition-transform"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A7060" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-10 flex flex-col gap-6">

          {/* Section 1: What to share */}
          <div>
            <p className="text-sm font-semibold text-[#1A1815] mb-3">What to share</p>
            <div className="flex bg-[#F0EBE0] border border-[#E8E2D8] rounded-2xl p-1 mb-3">
              <button
                onClick={() => setShareType('all')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  shareType === 'all'
                    ? 'bg-[#FDFAF5] text-[#1A1815] shadow-sm border border-[#E8E2D8]'
                    : 'text-[#7A7060]'
                }`}
              >
                All my favorites
              </button>
              <button
                onClick={() => setShareType('city')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  shareType === 'city'
                    ? 'bg-[#FDFAF5] text-[#1A1815] shadow-sm border border-[#E8E2D8]'
                    : 'text-[#7A7060]'
                }`}
              >
                From a city
              </button>
            </div>

            {shareType === 'city' && cities.length > 1 && (
              <div className="relative mb-2">
                <select
                  value={selectedCity}
                  onChange={e => {
                    setSelectedCity(e.target.value)
                    setNoteEdited(false)
                  }}
                  className="w-full bg-[#F0EBE0] border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1815] appearance-none pr-10"
                >
                  {cities.map(c => (
                    <option key={c.city} value={c.city}>{c.city} · {c.country}</option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            )}

            <p className="text-xs text-[#7A7060]">
              <span className="font-semibold text-[#1A1815]">{filteredCafes.length}</span>{' '}
              café{filteredCafes.length !== 1 ? 's' : ''} will be shared
            </p>
          </div>

          {/* Section 2: Personal note */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-sm font-semibold text-[#1A1815]">
                Add a note{' '}
                <span className="font-normal text-[#9ca3af]">(optional)</span>
              </p>
            </div>
            <div className="relative">
              <textarea
                value={note}
                onChange={e => {
                  if (e.target.value.length <= 200) {
                    setNote(e.target.value)
                    setNoteEdited(true)
                  }
                }}
                placeholder={defaultNote}
                rows={3}
                className="w-full bg-[#F0EBE0] border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1A1815] resize-none leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <span className="absolute bottom-3 right-4 text-[11px] text-[#9ca3af] pointer-events-none">
                {note.length}/200
              </span>
            </div>
          </div>

          {/* Privacy disclaimer */}
          <div className="bg-[#F0EBE0] rounded-xl px-4 py-3 flex gap-3 items-start">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-[#7A7060] leading-relaxed">
              Only public café info is shared. Your stamps and visit history stay private.
            </p>
          </div>

          {/* Section 3: Share via */}
          <div>
            <p className="text-sm font-semibold text-[#1A1815] mb-4">Share via</p>
            <div className="flex gap-2 justify-around">

              {/* Copy link */}
              <button onClick={handleCopy} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors duration-200 ${
                  copied ? 'bg-[#E6C828] border-[#E6C828]' : 'bg-[#F0EBE0] border-[#E8E2D8]'
                }`}>
                  {copied
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                      </svg>
                  }
                </div>
                <span className="text-[11px] text-[#7A7060] font-medium">{copied ? 'Copied!' : 'Copy link'}</span>
              </button>

              {/* WhatsApp */}
              <button onClick={handleWhatsApp} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                <div className="w-14 h-14 rounded-2xl border border-[#E8E2D8] bg-[#F0EBE0] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-[11px] text-[#7A7060] font-medium">WhatsApp</span>
              </button>

              {/* SMS / Message */}
              <button onClick={handleSMS} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                <div className="w-14 h-14 rounded-2xl border border-[#E8E2D8] bg-[#F0EBE0] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <span className="text-[11px] text-[#7A7060] font-medium">Message</span>
              </button>

              {/* Email */}
              <button onClick={handleEmail} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                <div className="w-14 h-14 rounded-2xl border border-[#E8E2D8] bg-[#F0EBE0] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="text-[11px] text-[#7A7060] font-medium">Email</span>
              </button>

              {/* Native share — only if supported */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                  <div className="w-14 h-14 rounded-2xl border border-[#E8E2D8] bg-[#F0EBE0] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-[#7A7060] font-medium">Share</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
