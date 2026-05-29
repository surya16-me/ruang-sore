'use client'

import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatInput } from '@/components/chat/chat-input'

export default function ChatPage() {
  const { messages, sendMessage, status, stop } = useChat()
  const [input, setInput] = useState('')

  const isLoading = status === 'submitted' || status === 'streaming'

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-lg select-none">
          🌇
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">RuangSore</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isLoading ? 'sedang mengetik...' : 'online'}
          </p>
        </div>
      </header>

      <ChatWindow messages={messages} isLoading={isLoading} />

      <ChatInput
        input={input}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </div>
  )
}
