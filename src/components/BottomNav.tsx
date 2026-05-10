import { useLocation, useNavigate } from 'react-router-dom'

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const ScanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z" />
  </svg>
)

const RewardsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" rx="1" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </svg>
)

const DiscoverIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#000000' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
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

  const tabs = [
    { path: '/', label: 'Home', icon: (a: boolean) => <HomeIcon active={a} /> },
    { path: '/discover', label: 'Discover', icon: (a: boolean) => <DiscoverIcon active={a} /> },
    { path: '/scan', label: 'Scan', icon: (_a: boolean) => <ScanIcon />, special: true },
    { path: '/rewards', label: 'Rewards', icon: (a: boolean) => <RewardsIcon active={a} /> },
    { path: '/profile', label: 'Profile', icon: (a: boolean) => <ProfileIcon active={a} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-xl border-t border-[#dadada] z-[1000]">
      <div className="flex items-end justify-around px-2 pt-2 pb-5">
        {tabs.map((tab) => {
          const isActive = path === tab.path
          if (tab.special) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 -mt-5"
                aria-label={tab.label}
              >
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-95 transition-transform">
                  {tab.icon(isActive)}
                </div>
                <span className="text-[10px] font-medium text-[#5f5f5f]">{tab.label}</span>
              </button>
            )
          }
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform min-w-[56px]"
              aria-label={tab.label}
            >
              {tab.icon(isActive)}
              <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-[#9ca3af]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
