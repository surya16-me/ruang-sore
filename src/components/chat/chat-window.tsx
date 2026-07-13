'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { ChatMessage } from '@/components/chat/chat-message'
import { ChatEmptyState } from '@/components/chat/chat-empty-state'
import { TypingIndicator } from '@/components/chat/typing-indicator'

interface ChatWindowProps {
  messages: UIMessage[]
  isLoading: boolean
  onQuickEmotion?: (emotion: string) => void
}

export function ChatWindow({ messages, isLoading, onQuickEmotion }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.length === 0 && <ChatEmptyState onQuickEmotion={onQuickEmotion ?? (() => {})} />}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
