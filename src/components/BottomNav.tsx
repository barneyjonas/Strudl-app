import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DiscoverIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#1A1815' : 'rgba(255,255,255,0.6)'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const CafeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 -2 24 26" fill="none"
    stroke={active ? '#1A1815' : 'rgba(255,255,255,0.6)'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8h1a4 4 0 010 8h-1" />
    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
    <line x1="8" y1="1" x2="8" y2="4" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="16" y1="1" x2="16" y2="4" />
  </svg>
)

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#1A1815' : 'rgba(255,255,255,0.6)'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    { path: '/home',     label: 'Cafés',    icon: (a: boolean) => <CafeIcon active={a} /> },
    { path: '/profile',  label: 'Profile',  icon: (a: boolean) => <ProfileIcon active={a} /> },
  ]

  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-[1000] transition-all duration-300"
      style={{
        bottom: 'max(24px, env(safe-area-inset-bottom))',
        transform: sheetOpen
          ? 'translateX(-50%) translateY(140%) scale(0.9)'
          : 'translateX(-50%) translateY(0) scale(1)',
        opacity: sheetOpen ? 0 : 1,
        pointerEvents: sheetOpen ? 'none' : 'auto',
      }}
    >
      <div className="flex items-center bg-[#1A1815] rounded-full p-1.5 gap-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.36),0_2px_8px_rgba(0,0,0,0.18)]">
        {tabs.map((tab) => {
          const isActive = path === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              className={`w-[60px] h-12 flex flex-col items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                isActive ? 'bg-[#E6C828]' : 'bg-transparent'
              }`}
            >
              {tab.icon(isActive)}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
