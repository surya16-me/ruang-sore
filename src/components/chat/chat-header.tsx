import { Wind } from 'lucide-react'
import { AgentAvatar } from '@/components/shared/agent-avatar'

interface ChatHeaderProps {
  isLoading: boolean
  onBreathingGuide?: () => void
}

export function ChatHeader({ isLoading, onBreathingGuide }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
      <div className="w-0.5 h-6 bg-coral rounded-full shrink-0" />
      <AgentAvatar size="sm" />
      <div className="flex-1">
        <p className="font-semibold text-sm leading-none text-foreground">RuangSore</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLoading ? 'bg-sand animate-pulse' : 'bg-sage'
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isLoading ? 'menulis...' : 'siap dengar'}
          </span>
        </div>
      </div>

      {onBreathingGuide && (
        <button
          onClick={onBreathingGuide}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Panduan napas"
        >
          <Wind className="w-4 h-4" />
        </button>
      )}
    </header>
  )
}
