import { useState } from 'react'
import { useAppState } from '../store/appStore'
import logo from '/Logo_Strudl_no_Background.svg'

export default function Onboarding() {
  const [, setAppState] = useAppState()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('Alex')
  const [email, setEmail] = useState('alex@example.com')

  const handleStep2Continue = () => {
    setAppState({ user: { name, email, phone: '+43 650 123 4567', notifyPush: true, notifyLapsed: false } })
    setStep(3)
  }

  const handleFinish = () => {
    setAppState({ onboarded: true })
  }

  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      {step === 1 && (
        <div className="flex flex-col items-center text-center w-full max-w-xs gap-6 -mt-12">
          <img src={logo} alt="Strudl" className="w-64 h-64" />
          <div className="flex flex-col gap-3 -mt-20">
            <p className="text-4xl font-black text-[#0f0f0f] leading-tight" style={{ letterSpacing: '-0.03em' }}>
              Strudl, drink<br />like a local.
            </p>
            <p className="text-[#5f5f5f] text-sm leading-relaxed">
              Collect stamps at any café.<br />Earn free coffee. No cards, no fuss.
            </p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-black text-white font-bold text-base py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.14)] border border-black"
          >
            Get started
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full max-w-xs gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-[#0f0f0f] tracking-tight" style={{ letterSpacing: '-0.02em' }}>Who are you?</h2>
            <p className="text-[#5f5f5f] text-sm">We'll personalise your experience.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#5f5f5f] text-xs font-medium uppercase tracking-wider">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#f6f6f6] border border-[#dadada] rounded-xl px-4 py-3.5 text-[#0f0f0f] text-base outline-none focus:border-black transition-colors placeholder-[#9ca3af]"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#5f5f5f] text-xs font-medium uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#f6f6f6] border border-[#dadada] rounded-xl px-4 py-3.5 text-[#0f0f0f] text-base outline-none focus:border-black transition-colors placeholder-[#9ca3af]"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <button
            onClick={handleStep2Continue}
            disabled={!name.trim() || !email.trim()}
            className="w-full bg-black text-white font-bold text-base py-4 rounded-full active:scale-95 transition-transform disabled:opacity-30 border border-black"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col w-full max-w-xs gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-[#0f0f0f] tracking-tight" style={{ letterSpacing: '-0.02em' }}>One last thing</h2>
            <p className="text-[#5f5f5f] text-sm">These help us give you the best experience.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[#0f0f0f] font-semibold text-sm">Enable notifications</p>
                <p className="text-[#5f5f5f] text-xs mt-0.5">Get stamp confirmations & rewards</p>
              </div>
              <button
                onClick={() => {}}
                className="text-black text-sm font-bold active:scale-95 transition-transform"
              >
                Allow
              </button>
            </div>

            <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ededed] flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[#0f0f0f] font-semibold text-sm">Allow location</p>
                <p className="text-[#5f5f5f] text-xs mt-0.5">Find Strudl cafés near you</p>
              </div>
              <button
                onClick={() => {}}
                className="text-black text-sm font-bold active:scale-95 transition-transform"
              >
                Allow
              </button>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-black text-white font-bold text-base py-4 rounded-full active:scale-95 transition-transform shadow-[0_14px_30px_rgba(0,0,0,0.14)] border border-black"
          >
            Start collecting ☕
          </button>
          <button
            onClick={handleFinish}
            className="text-[#5f5f5f] text-sm text-center active:scale-95 transition-transform"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  )
}
