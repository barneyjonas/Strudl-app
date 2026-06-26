import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StampSuccess.css'

interface Props {
  stamps: number
  total?: number
}

function playDing(enabled: boolean, celebration = false) {
  if (!enabled) return
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx() as AudioContext
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(celebration ? 880 : 660, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(celebration ? 440 : 330, ctx.currentTime + (celebration ? 0.8 : 0.5))
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(celebration ? 0.4 : 0.28, ctx.currentTime + 0.07)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (celebration ? 1.5 : 1.0))
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + (celebration ? 1.5 : 1.0))
    setTimeout(() => { try { ctx.close() } catch { /* already closed */ } }, celebration ? 1800 : 1200)
  } catch { /* autoplay blocked or AudioContext unavailable — silent fail */ }
}

export default function StampSuccess({ stamps, total = 9 }: Props) {
  const navigate = useNavigate()
  const isRewardReady = stamps >= total
  const [soundOn, setSoundOn] = useState(
    () => localStorage.getItem('strudl_sound') !== 'false'
  )

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    localStorage.setItem('strudl_sound', String(next))
  }

  useEffect(() => {
    const enabled = localStorage.getItem('strudl_sound') !== 'false'
    playDing(enabled, stamps >= total)

    const t = setTimeout(() => {
      if ('vibrate' in navigator) navigator.vibrate(stamps >= total ? [40, 60, 40] : 40)
    }, 1200)

    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center text-center gap-6 relative">

      {/* Mute toggle */}
      <button
        onClick={toggleSound}
        className="absolute -top-2 right-0 w-9 h-9 flex items-center justify-center rounded-full text-white/30 active:scale-95 transition-transform"
        aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
      >
        {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
      </button>

      {/* Animated circle */}
      <div className="relative w-28 h-28">
        <div className="ss-ripple" aria-hidden="true" />
        {isRewardReady && <div className="ss-ripple ss-ripple-2" aria-hidden="true" />}
        <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.18)] ss-circle">
          <AnimatedCup />
        </div>
      </div>

      {/* Result text */}
      <div>
        <p className="text-[#FDFAF5] font-bold text-5xl mb-1 ss-text-1" style={{ letterSpacing: '-0.04em' }}>+1</p>
        <p className="text-[#FDFAF5] font-semibold text-2xl ss-text-1" style={{ letterSpacing: '-0.02em' }}>stamp</p>
        {isRewardReady ? (
          <p className="text-[#E6C828] font-semibold text-sm mt-2 ss-text-2">
            Your free coffee is ready.
          </p>
        ) : (
          <p className="text-white/40 text-sm mt-2 ss-text-2">
            <span className="ss-count">{stamps}</span> of {total} — you were here.
          </p>
        )}
      </div>

      {/* Done / Claim button */}
      {isRewardReady ? (
        <button
          onClick={() => navigate('/rewards', { state: { redeem: true } })}
          className="font-bold text-base py-4 px-12 rounded-full active:scale-95 transition-transform ss-done"
          style={{ background: '#E6C828', color: '#1A1815', border: '1px solid #E6C828', boxShadow: '0 14px 30px rgba(230,200,40,0.30)' }}
          aria-label="Claim your free coffee"
        >
          Claim coffee
        </button>
      ) : (
        <button
          onClick={() => navigate('/')}
          className="bg-[#FDFAF5] text-[#1A1815] font-semibold text-sm py-4 px-12 rounded-2xl active:scale-95 transition-transform ss-done"
          aria-label="Done, return to home"
        >
          Done
        </button>
      )}

    </div>
  )
}

function AnimatedCup() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="ss-cup-clip">
          <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
        </clipPath>
      </defs>

      <g clipPath="url(#ss-cup-clip)">
        <rect x="4" y="8" width="16" height="13" fill="#92400E" className="ss-fill" />
      </g>

      <path
        d="M20 8h1a4 4 0 010 8h-1"
        stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z"
        stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />

      <line x1="8"  y1="4" x2="8"  y2="1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" className="ss-steam ss-steam-1" />
      <line x1="12" y1="4" x2="12" y2="1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" className="ss-steam ss-steam-2" />
      <line x1="16" y1="4" x2="16" y2="1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" className="ss-steam ss-steam-3" />
    </svg>
  )
}

function SoundOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
