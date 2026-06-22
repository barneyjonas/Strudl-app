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

const ScanIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="5" rx="1" />
    <rect x="16" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <line x1="21" y1="16" x2="21" y2="21" />
    <line x1="16" y1="21" x2="21" y2="21" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const tabs = [
    { path: '/discover', label: 'Discover', icon: (a: boolean) => <DiscoverIcon active={a} /> },
    { path: '/home', label: 'Cafés', icon: (a: boolean) => <CafeIcon active={a} />, scanFab: true },
    { path: '/profile', label: 'Profile', icon: (a: boolean) => <ProfileIcon active={a} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-xl border-t border-[#dadada] z-[1000]">
      <div className="flex items-end justify-around px-2 pt-2 pb-5">
        {tabs.map((tab) => {
          const isActive = path === tab.path
          return (
            <div key={tab.path} className="relative flex flex-col items-center min-w-[56px]">
              {tab.scanFab && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-14 z-10">
                  <button
                    onClick={() => navigate('/scan')}
                    aria-label="Scan stamp"
                    className="w-[52px] h-[52px] rounded-full bg-black flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.35)] border-2 border-white active:scale-95 transition-transform"
                  >
                    <ScanIcon />
                  </button>
                </div>
              )}
              <button
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                aria-label={tab.label}
              >
                {tab.icon(isActive)}
                <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-[#9ca3af]'}`}>
                  {tab.label}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
