import { QuickEmotions } from '@/components/chat/quick-emotions'

interface ChatEmptyStateProps {
  onQuickEmotion: (emotion: string) => void
}

export function ChatEmptyState({ onQuickEmotion }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 pt-24 pb-10 text-center px-4">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F2CC8F" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="90" r="70" fill="url(#emptyGrad)" opacity="0.85" />
          <clipPath id="emptyHorizon">
            <rect x="0" y="130" width="200" height="70" />
          </clipPath>
          <circle cx="100" cy="90" r="70" fill="#3D405B" opacity="0.12" clipPath="url(#emptyHorizon)" />
          <line x1="30" y1="145" x2="170" y2="145" stroke="#3D405B" strokeWidth="1.5" opacity="0.2" />
          <circle cx="160" cy="60" r="10" fill="#F2CC8F" opacity="0.5" />
          <circle cx="40" cy="80" r="6" fill="#81B29A" opacity="0.4" />
        </svg>
      </div>
      <div>
        <h2 className="font-semibold text-lg text-foreground">
          Halo, aku <span className="text-coral">RuangSore</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
          Aku di sini buat dengerin kamu — tanpa menghakimi. Cerita aja apa
          yang lagi kamu rasain.
        </p>
      </div>

      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-3">Atau pilih yang kamu rasain:</p>
        <QuickEmotions onSelect={onQuickEmotion} />
      </div>
    </div>
  )
}
