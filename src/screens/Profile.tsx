import { useState } from 'react'
import { useAppState } from '../store/appStore'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none active:scale-95 border ${
        checked ? 'bg-black border-black' : 'bg-[#ededed] border-[#dadada]'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function Profile() {
  const [state, setState] = useAppState()
  const { user, lifetimeStamps, lifetimeRewards, favoriteCafes } = state

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [saved, setSaved] = useState(false)

  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  const topCafe = favoriteCafes[0]?.name ?? '—'

  const handleSave = () => {
    setState({ user: { ...user, name, email, phone } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = () => {
    setState({ onboarded: false })
  }

  return (
    <div className="app-shell overflow-y-auto">
      <div className="px-4 pt-12 pb-28">

        <h1 className="text-2xl font-black text-[#0f0f0f] tracking-tight mb-6" style={{ letterSpacing: '-0.03em' }}>Profile</h1>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#ededed] border border-[#dadada] flex items-center justify-center">
            <span className="text-[#0f0f0f] font-black text-2xl" style={{ letterSpacing: '-0.02em' }}>{initials}</span>
          </div>
          <div className="text-center">
            <p className="text-[#0f0f0f] font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>{user.name}</p>
            <p className="text-[#5f5f5f] text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-3 flex flex-col items-center gap-1">
            <span className="text-[#0f0f0f] font-black text-2xl" style={{ letterSpacing: '-0.03em' }}>{lifetimeStamps}</span>
            <span className="text-[#5f5f5f] text-[10px] text-center leading-tight">Lifetime stamps</span>
          </div>
          <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-3 flex flex-col items-center gap-1">
            <span className="text-[#0f0f0f] font-black text-2xl" style={{ letterSpacing: '-0.03em' }}>{lifetimeRewards}</span>
            <span className="text-[#5f5f5f] text-[10px] text-center leading-tight">Rewards redeemed</span>
          </div>
          <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-3 flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
              <path d="M20 8h1a4 4 0 010 8h-1" />
              <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
              <line x1="8" y1="1" x2="8" y2="4" />
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="16" y1="1" x2="16" y2="4" />
            </svg>
            <span className="text-[#5f5f5f] text-[10px] text-center leading-tight truncate w-full">{topCafe}</span>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 mb-4">
          <h2 className="text-[#0f0f0f] font-bold text-base mb-4" style={{ letterSpacing: '-0.01em' }}>Edit profile</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#5f5f5f] text-xs font-medium uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-[#dadada] rounded-xl px-4 py-3 text-[#0f0f0f] text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#5f5f5f] text-xs font-medium uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-[#dadada] rounded-xl px-4 py-3 text-[#0f0f0f] text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#5f5f5f] text-xs font-medium uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border border-[#dadada] rounded-xl px-4 py-3 text-[#0f0f0f] text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              onClick={handleSave}
              className={`w-full py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 border ${
                saved
                  ? 'bg-[#f6f6f6] text-[#0f0f0f] border-[#dadada]'
                  : 'bg-black text-white border-black shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#f6f6f6] border border-[#dadada] rounded-2xl p-4 mb-4">
          <h2 className="text-[#0f0f0f] font-bold text-base mb-4" style={{ letterSpacing: '-0.01em' }}>Notifications</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#0f0f0f] text-sm font-medium">Push notifications</p>
                <p className="text-[#5f5f5f] text-xs">Stamp confirmations & rewards</p>
              </div>
              <Toggle
                checked={user.notifyPush}
                onChange={() => setState({ user: { ...user, notifyPush: !user.notifyPush } })}
              />
            </div>
            <div className="h-px bg-[#dadada]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#0f0f0f] text-sm font-medium">Lapsed reminders</p>
                <p className="text-[#5f5f5f] text-xs">Nudge when you haven't visited</p>
              </div>
              <Toggle
                checked={user.notifyLapsed}
                onChange={() => setState({ user: { ...user, notifyLapsed: !user.notifyLapsed } })}
              />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <p className="text-[#5f5f5f] text-xs text-center leading-relaxed mb-6 px-4">
          Your data is anonymised before being shared with cafés.
        </p>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full border border-[#dadada] text-[#5f5f5f] font-semibold text-sm py-4 rounded-full active:scale-95 transition-transform"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
