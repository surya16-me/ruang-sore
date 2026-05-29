'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, LogOut, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types'

interface ConversationSidebarProps {
  userEmail: string
}

export function ConversationSidebar({ userEmail }: ConversationSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeId = searchParams.get('id')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadConversations = useCallback(() => {
    let cancelled = false
    fetch('/api/conversations')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Conversation[]) => {
        if (!cancelled) {
          setConversations(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('[ConversationSidebar]', err)
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(loadConversations, [loadConversations])

  // Reload when active conversation changes (new one may have been created)
  useEffect(loadConversations, [activeId, loadConversations])

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()

    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations((prev) => prev.filter((c) => c.id !== id))

    if (activeId === id) {
      router.push('/chat')
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r border-border bg-muted/30 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="text-lg select-none">🌇</span>
        <span className="font-semibold text-sm">RuangSore</span>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3">
        <Link
          href="/chat"
          className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Percakapan baru
        </Link>
      </div>

      {/* Conversation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {isLoading ? (
          <div className="text-xs text-muted-foreground px-3 py-2">Memuat...</div>
        ) : conversations.length === 0 ? (
          <div className="text-xs text-muted-foreground px-3 py-6 text-center">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-40" />
            Belum ada percakapan
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="group relative">
              <Link
                href={`/chat?id=${conv.id}`}
                className={cn(
                  'flex items-center w-full rounded-xl px-3 py-2 text-sm pr-8 transition-colors truncate',
                  activeId === conv.id
                    ? 'bg-muted font-medium'
                    : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="truncate">{conv.title}</span>
              </Link>
              <button
                onClick={(e) => void handleDelete(e, conv.id)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                aria-label="Hapus percakapan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </nav>

      {/* User Footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold uppercase shrink-0">
            {userEmail.charAt(0)}
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
            {userEmail}
          </span>
          <button
            onClick={() => void handleSignOut()}
            className="p-1 rounded-lg hover:bg-muted transition-colors shrink-0"
            aria-label="Keluar"
          >
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
