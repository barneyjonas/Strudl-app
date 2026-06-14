interface StampCardProps {
  stamps: number
  total?: number
}

const CoffeeCupIcon = () => (
  <svg width="22" height="22" viewBox="0 -2 24 26" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8h1a4 4 0 010 8h-1" />
    <path d="M4 8h16v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
    <line x1="8" y1="1" x2="8" y2="4" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="16" y1="1" x2="16" y2="4" />
  </svg>
)

export default function StampCard({ stamps, total = 10 }: StampCardProps) {
  const paid = total - 1  // 9 paid stamps, 10th slot is the free reward
  const isRewardReady = stamps >= paid

  return (
    <div className="bg-[#f6f6f6] rounded-2xl p-5 w-full border border-[#dadada]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#0f0f0f] font-bold text-base tracking-tight">Loyalty Card</span>
        <span className="text-[#0f0f0f] font-bold text-sm">{Math.min(stamps, paid)}/{paid}</span>
      </div>
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: total }).map((_, i) => {
          if (i === total - 1) {
            return (
              <div
                key={i}
                className={`aspect-square rounded-full flex items-center justify-center transition-all duration-500 ${
                  isRewardReady
                    ? 'bg-[#E6C828] animate-pulse'
                    : 'border-2 border-dashed border-[#E6C828]'
                }`}
              >
                <span className={`text-[9px] font-black leading-none tracking-tight ${
                  isRewardReady ? 'text-black' : 'text-[#E6C828]'
                }`}>FREE</span>
              </div>
            )
          }

          const filled = i < stamps
          return (
            <div
              key={i}
              className={`aspect-square rounded-full flex items-center justify-center ${
                filled ? 'bg-black shadow-sm' : 'bg-transparent border-2 border-[#dadada]'
              }`}
            >
              {filled && <CoffeeCupIcon />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
