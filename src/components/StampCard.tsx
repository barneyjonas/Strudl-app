interface StampCardProps {
  stamps: number
  total?: number
}

const CoffeeCupIcon = () => (
  <svg width="18" height="18" viewBox="0 -2 24 26" fill="none"
    stroke="#1A1815" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8h1a4 4 0 010 8h-1" />
    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
    <line x1="8" y1="1" x2="8" y2="4" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="16" y1="1" x2="16" y2="4" />
  </svg>
)

export default function StampCard({ stamps, total = 10 }: StampCardProps) {
  const paid = total - 1
  const isRewardReady = stamps >= paid

  return (
    <div className="relative rounded-3xl overflow-hidden w-full"
      style={{ background: 'linear-gradient(135deg, #1A1815 0%, #2E2920 60%, #1A1815 100%)' }}>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* Yellow accent glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
        style={{ background: '#E6C828', filter: 'blur(40px)' }} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.15em]">Loyalty Card</span>
          <span className={`text-sm font-bold ${isRewardReady ? 'text-[#E6C828]' : 'text-white/50'}`}>
            {Math.min(stamps, paid)}<span className="text-white/30">/{paid}</span>
          </span>
        </div>

        {/* Stamps grid */}
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: total }).map((_, i) => {
            if (i === total - 1) {
              return (
                <div key={i}
                  className={`aspect-square rounded-full flex items-center justify-center transition-all duration-500 ${
                    isRewardReady
                      ? 'bg-[#E6C828]'
                      : 'border border-dashed border-[#E6C828]/40'
                  }`}
                >
                  <span className={`text-[8px] font-bold leading-none tracking-tight ${
                    isRewardReady ? 'text-[#1A1815]' : 'text-[#E6C828]/60'
                  }`}>FREE</span>
                </div>
              )
            }
            const filled = i < stamps
            return (
              <div key={i}
                className={`aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                  filled ? 'bg-[#E6C828]' : 'bg-white/8 border border-white/10'
                }`}
                style={filled ? {} : { background: 'rgba(255,255,255,0.06)' }}
              >
                {filled && <CoffeeCupIcon />}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {isRewardReady && (
          <p className="text-[#E6C828] text-xs font-semibold mt-5 text-center tracking-wide">
            Free coffee ready to redeem ✦
          </p>
        )}
        {!isRewardReady && (
          <p className="text-white/25 text-[10px] mt-5 text-center tracking-wide">
            {paid - Math.min(stamps, paid)} more {paid - Math.min(stamps, paid) === 1 ? 'stamp' : 'stamps'} for a free coffee
          </p>
        )}
      </div>
    </div>
  )
}
