import type { UIMessage } from 'ai'
import { cn } from '@/lib/utils'
import { AgentAvatar } from '@/components/shared/agent-avatar'

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const text = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p.type === 'text' ? p.text : ''))
    .join('')

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {isUser ? (
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-indigo flex items-center justify-center">
          <span className="text-xs font-bold text-white/90">U</span>
        </div>
      ) : (
        <AgentAvatar size="sm" />
      )}

      <div
        className={cn(
          'min-w-0 max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words border-l-2',
          isUser
            ? 'border-indigo mr-2'
            : 'border-coral'
        )}
      >
        <p className="text-foreground">{text}</p>
      </div>
    </div>
  )
}
