'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { toast } from 'sonner'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatInput } from '@/components/chat/chat-input'
import { BreathingGuide } from '@/components/chat/breathing-guide'
import { MoodPicker } from '@/components/chat/mood-picker'

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
  const [showBreathing, setShowBreathing] = useState(false)
  const [moodLoggedFor, setMoodLoggedFor] = useState<string | null>(null)

  const activeConvIdRef = useRef<string | null>(convId)

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    onFinish: async ({ message, isAbort }) => {
      if (isAbort) return
      const currentConvId = activeConvIdRef.current
      if (!currentConvId) return

      const textPart = message.parts.find((p) => p.type === 'text')
      if (!textPart || textPart.type !== 'text') return

      try {
        const res = await fetch(`/api/conversations/${currentConvId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: textPart.text }),
        })
        if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      } catch (err) {
        console.error('[chat/page onFinish]', err)
        toast.error('Gagal menyimpan pesan')
      }
    },
  })

  const showMoodPicker = messages.length >= 2 && moodLoggedFor !== convId

  useEffect(() => {
    activeConvIdRef.current = convId

    if (!convId) {
      setMessages([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/conversations/${convId}/messages`)
        if (!res.ok) throw new Error(`Load failed: ${res.status}`)
        const msgs: DbMessage[] = await res.json()
        if (!cancelled) setMessages(msgs.map(toUIMessage))
      } catch (err) {
        console.error('[chat/page loadHistory]', err)
        toast.error('Gagal memuat riwayat percakapan')
      }
    })()

    return () => { cancelled = true }
  }, [convId, setMessages])

  const isLoading = status === 'submitted' || status === 'streaming'

  async function handleQuickEmotion(emotion: string) {
    setInput('')
    let currentConvId = convId

    if (!currentConvId) {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: emotion }),
        })
        if (!res.ok) throw new Error(`Create failed: ${res.status}`)
        const conv: { id: string } = await res.json()
        currentConvId = conv.id
        activeConvIdRef.current = currentConvId
        router.replace(`/chat?id=${currentConvId}`)
      } catch (err) {
        console.error('[chat/page createConv]', err)
        toast.error('Gagal membuat percakapan baru')
        return
      }
    }

    const text = `Aku lagi merasa ${emotion.toLowerCase()}`
    try {
      const res = await fetch(`/api/conversations/${currentConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: text }),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
    } catch (err) {
      console.error('[chat/page saveQuickEmotion]', err)
      toast.error('Gagal menyimpan pesan')
      return
    }

    sendMessage({ text })
  }

  async function handleMoodSelect(mood: number) {
    setMoodLoggedFor(convId)

    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      })
    } catch (err) {
      console.error('[chat/page logMood]', err)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')

    let currentConvId = convId

    if (!currentConvId) {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.slice(0, 60) }),
        })
        if (!res.ok) throw new Error(`Create failed: ${res.status}`)
        const conv: { id: string } = await res.json()
        currentConvId = conv.id
        activeConvIdRef.current = currentConvId
        router.replace(`/chat?id=${currentConvId}`)
      } catch (err) {
        console.error('[chat/page createConv]', err)
        toast.error('Gagal membuat percakapan baru')
        return
      }
    }

    try {
      const res = await fetch(`/api/conversations/${currentConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: text }),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
    } catch (err) {
      console.error('[chat/page saveUserMsg]', err)
      toast.error('Gagal menyimpan pesan')
      return
    }

    sendMessage({ text })
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader
        isLoading={isLoading}
        onBreathingGuide={() => setShowBreathing(true)}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onQuickEmotion={handleQuickEmotion}
      />

      {showMoodPicker && messages.length > 0 && (
        <div className="border-t border-border bg-background px-4 py-2">
          <MoodPicker onSelect={handleMoodSelect} className="justify-center" />
        </div>
      )}

      <ChatInput
        input={input}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onStop={stop}
      />

      {showBreathing && (
        <BreathingGuide onClose={() => setShowBreathing(false)} />
      )}
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
