import { useState } from 'react'
import { useAppState } from '../store/appStore'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none active:scale-95 ${
        checked ? 'bg-[#1A1815]' : 'bg-[#E8E2D8]'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#FDFAF5] rounded-full shadow transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`} />
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
      <div className="px-5 pt-14 pb-32">

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: '#1A1815' }}>
            <span className="text-[#E6C828] font-bold text-2xl">{initials}</span>
          </div>
          <div className="text-center">
            <p className="text-[#1A1815] font-bold text-lg">{user.name}</p>
            <p className="text-[#7A7060] text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[
            { value: lifetimeStamps, label: 'Stamps' },
            { value: lifetimeRewards, label: 'Rewards' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#FDFAF5] rounded-2xl p-4 flex flex-col items-center gap-1 border border-[#E8E2D8]">
              <span className="text-[#1A1815] font-bold text-2xl">{value}</span>
              <span className="text-[#7A7060] text-[10px] text-center">{label}</span>
            </div>
          ))}
          <div className="bg-[#FDFAF5] rounded-2xl p-4 flex flex-col items-center gap-1 border border-[#E8E2D8]">
            <svg width="22" height="22" viewBox="0 -2 24 26" fill="none"
              stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 8h1a4 4 0 010 8h-1" />
              <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
              <line x1="8" y1="1" x2="8" y2="4" />
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="16" y1="1" x2="16" y2="4" />
            </svg>
            <span className="text-[#7A7060] text-[10px] text-center leading-tight truncate w-full">{topCafe}</span>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-[#FDFAF5] rounded-2xl p-5 mb-3 border border-[#E8E2D8]">
          <h2 className="text-[#1A1815] font-semibold text-sm mb-4">Edit profile</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Name', value: name, setter: setName, type: 'text', placeholder: 'Your name' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
              { label: 'Phone', value: phone, setter: setPhone, type: 'tel', placeholder: '+43 650 123 4567' },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[#7A7060] text-[10px] font-semibold uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="bg-[#FDFAF5] border border-[#E8E2D8] rounded-xl px-4 py-3 text-[#1A1815] text-sm outline-none focus:border-[#1A1815] transition-colors"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98] mt-1 ${
                saved
                  ? 'bg-[#F0EBE0] text-[#7A7060] border border-[#E8E2D8]'
                  : 'bg-[#1A1815] text-[#FDFAF5]'
              }`}
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#FDFAF5] rounded-2xl p-5 mb-3 border border-[#E8E2D8]">
          <h2 className="text-[#1A1815] font-semibold text-sm mb-4">Notifications</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#1A1815] text-sm font-medium">Push notifications</p>
                <p className="text-[#7A7060] text-xs mt-0.5">Stamp confirmations & rewards</p>
              </div>
              <Toggle
                checked={user.notifyPush}
                onChange={() => setState({ user: { ...user, notifyPush: !user.notifyPush } })}
              />
            </div>
            <div className="h-px bg-[#E8E2D8]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#1A1815] text-sm font-medium">Gentle nudges</p>
                <p className="text-[#7A7060] text-xs mt-0.5">When it's been a while</p>
              </div>
              <Toggle
                checked={user.notifyLapsed}
                onChange={() => setState({ user: { ...user, notifyLapsed: !user.notifyLapsed } })}
              />
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-[#7A7060] text-xs text-center leading-relaxed mb-6 px-4">
          Your data is anonymised before being shared with cafés.
        </p>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full border border-[#E8E2D8] text-[#7A7060] font-medium text-sm py-4 rounded-full active:scale-[0.98] transition-transform"
        >
          Sign out
        </button>

        {/* Legal */}
        <div className="mt-6 border-t border-[#E8E2D8] pt-4">
          <p className="text-[#7A7060] text-[10px] font-semibold uppercase tracking-wider mb-3">Rechtliches</p>
          {[
            { label: 'Impressum', href: 'https://barneyjonas.github.io/strudl-cafes-platform/impressum' },
            { label: 'AGB', href: 'https://barneyjonas.github.io/strudl-cafes-platform/agb' },
            { label: 'Datenschutzerklärung', href: 'https://barneyjonas.github.io/strudl-cafes-platform/datenschutz' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#7A7060] py-2.5 border-b border-[#E8E2D8] last:border-0 active:opacity-60 transition-opacity"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
