import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DiscoverIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const CafeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 -2 24 26" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8h1a4 4 0 010 8h-1" />
    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
    <line x1="8" y1="1" x2="8" y2="4" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="16" y1="1" x2="16" y2="4" />
  </svg>
)

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)


export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      setSheetOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    }
    window.addEventListener('strudl_sheet_open', handler)
    return () => window.removeEventListener('strudl_sheet_open', handler)
  }, [])

  const tabs = [
    { path: '/discover', label: 'Discover', icon: (a: boolean) => <DiscoverIcon active={a} /> },
    { path: '/home', label: 'Cafés', icon: (a: boolean) => <CafeIcon active={a} /> },
    { path: '/profile', label: 'Profile', icon: (a: boolean) => <ProfileIcon active={a} /> },
  ]

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-xl border-t border-[#dadada] z-[1000] transition-transform duration-300 ${sheetOpen ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="flex items-end justify-around px-2 pt-2" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        {tabs.map((tab) => {
          const isActive = path === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform min-w-[56px]"
              aria-label={tab.label}
            >
              <div className={`w-5 h-[3px] rounded-full mb-0.5 transition-colors ${isActive ? 'bg-black' : 'bg-transparent'}`} />
              {tab.icon(isActive)}
              <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-[#6b7280]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
