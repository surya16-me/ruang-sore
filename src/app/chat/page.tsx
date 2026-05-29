'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatInput } from '@/components/chat/chat-input'

interface DbMessage {
  id: string
  role: string
  content: string
  created_at: string
}

function toUIMessage(m: DbMessage): UIMessage {
  const role = m.role === 'user' ? 'user' : 'assistant'
  return {
    id: m.id,
    role,
    parts: [{ type: 'text', text: m.content }],
  }
}

function ChatPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const convId = searchParams.get('id')

  const [input, setInput] = useState('')

  // Tracks the active conversation ID at time of message send
  // (separate from URL param to avoid onFinish saving to wrong conversation)
  const activeConvIdRef = useRef<string | null>(convId)

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    onFinish: ({ message, isAbort }) => {
      if (isAbort) return
      const currentConvId = activeConvIdRef.current
      if (!currentConvId) return

      const textPart = message.parts.find((p) => p.type === 'text')
      if (!textPart || textPart.type !== 'text') return

      fetch(`/api/conversations/${currentConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: textPart.text }),
      }).catch((err) => console.error('[chat/page onFinish]', err))
    },
  })

  // Load message history when conversation ID changes
  useEffect(() => {
    activeConvIdRef.current = convId

    if (!convId) {
      setMessages([])
      return
    }

    let cancelled = false
    fetch(`/api/conversations/${convId}/messages`)
      .then((r) => r.json())
      .then((msgs: DbMessage[]) => {
        if (!cancelled) setMessages(msgs.map(toUIMessage))
      })
      .catch((err) => console.error('[chat/page loadHistory]', err))

    return () => {
      cancelled = true
    }
  }, [convId, setMessages])

  const isLoading = status === 'submitted' || status === 'streaming'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')

    let currentConvId = convId

    // Create a new conversation if one doesn't exist
    if (!currentConvId) {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.slice(0, 60) }),
        })
        const conv: { id: string } = await res.json()
        currentConvId = conv.id
        activeConvIdRef.current = currentConvId
        router.replace(`/chat?id=${currentConvId}`)
      } catch (err) {
        console.error('[chat/page createConv]', err)
        return
      }
    }

    // Persist user message (fire and forget — UI updates via useChat)
    fetch(`/api/conversations/${currentConvId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: text }),
    }).catch((err) => console.error('[chat/page saveUserMsg]', err))

    sendMessage({ text })
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader isLoading={isLoading} />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
      />
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

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  )
}
