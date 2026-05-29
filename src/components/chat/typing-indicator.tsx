import { AgentAvatar } from '@/components/shared/agent-avatar'

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <AgentAvatar size="sm" />
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}
