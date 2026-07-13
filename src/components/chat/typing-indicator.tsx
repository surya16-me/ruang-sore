import { AgentAvatar } from '@/components/shared/agent-avatar'

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <AgentAvatar size="sm" />
      <div className="px-4 py-3">
        <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-coral via-sand to-sage bg-[length:200%_100%] animate-pulse" />
      </div>
    </div>
  )
}
