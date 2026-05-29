import { AgentAvatar } from '@/components/shared/agent-avatar'

interface ChatHeaderProps {
  isLoading: boolean
}

export function ChatHeader({ isLoading }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <AgentAvatar size="md" />
      <div>
        <p className="font-semibold text-sm leading-none">RuangSore</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isLoading ? 'sedang mengetik...' : 'online'}
        </p>
      </div>
    </header>
  )
}
