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
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6"
      style={{ background: '#FDFAF5' }}>

      {step === 1 && (
        <div className="flex flex-col items-center text-center w-full max-w-xs gap-8 -mt-8">
          {/* Logo on dark pill — the brand mark */}
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: '#1A1815' }}>
            <img src={logo} alt="Strudl" className="w-16 h-16" style={{ filter: 'invert(1)' }} />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-[#1A1815] leading-tight">
              Drink like<br />a local.
            </h1>
            <p className="text-[#7A7060] text-sm leading-relaxed">
              Collect stamps at the cafés you love.<br />Earn free coffee. No cards, no apps to juggle.
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-transform"
            style={{ boxShadow: '0 8px 24px rgba(26,24,21,0.2)' }}
          >
            Get started
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full max-w-xs gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1815]">Who are you?</h2>
            <p className="text-[#7A7060] text-sm mt-1">So we know who to greet.</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: 'Your name', value: name, setter: setName, type: 'text', placeholder: 'Your name' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[#7A7060] text-[10px] font-semibold uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="bg-[#F0EBE0] border border-[#E8E2D8] rounded-xl px-4 py-3.5 text-[#1A1815] text-base outline-none focus:border-[#1A1815] transition-colors placeholder-[#C8BFB0]"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStep2Continue}
            disabled={!name.trim() || !email.trim()}
            className="w-full bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col w-full max-w-xs gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1815]">One last thing</h2>
            <p className="text-[#7A7060] text-sm mt-1">Two small things that make a big difference.</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                ),
                title: 'Enable notifications',
                desc: 'Stamp confirmations & rewards',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                title: 'Allow location',
                desc: 'Find Strudl cafés near you',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-[#E8E2D8]">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#F0EBE0' }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-[#1A1815] font-medium text-sm">{title}</p>
                  <p className="text-[#7A7060] text-xs mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => {}}
                  className="text-[#1A1815] text-sm font-semibold active:scale-95 transition-transform"
                >
                  Allow
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-[#1A1815] text-[#FDFAF5] font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-transform"
            style={{ boxShadow: '0 8px 24px rgba(26,24,21,0.2)' }}
          >
            Start collecting
          </button>
          <button
            onClick={handleFinish}
            className="text-[#7A7060] text-sm text-center active:scale-95 transition-transform"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  )
}
