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
    <div className={cn('flex items-end gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <AgentAvatar size="sm" />}

      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        {text}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary">U</span>
        </div>
      )}
    </div>
  )
}
