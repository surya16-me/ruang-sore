'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { ChatMessage } from '@/components/chat/chat-message'

interface ChatWindowProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 pt-20 pb-10 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl select-none">
              🌇
            </div>
            <div>
              <p className="font-semibold">Halo, aku RuangSore</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Aku di sini buat dengerin kamu — tanpa menghakimi.
                Cerita aja apa yang lagi kamu rasain.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0 select-none">
              🌇
            </div>
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
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
