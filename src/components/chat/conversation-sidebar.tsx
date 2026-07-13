'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, LogOut, MessageCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Conversation } from '@/types'
import { MoodCalendar } from '@/components/chat/mood-calendar'

interface ConversationSidebarProps {
  userEmail: string
}

export function ConversationSidebar({ userEmail }: ConversationSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeId = searchParams.get('id')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadConversations = useCallback(() => {
    let cancelled = false
    fetch('/api/conversations')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Conversation[]) => {
        if (!cancelled) setConversations(data)
      })
      .catch((err) => console.error('[ConversationSidebar]', err))
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => { loadConversations() }, [activeId, loadConversations])

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    setDeletingId(id)

    try {
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeId === id) router.push('/chat')
    } catch (err) {
      console.error('[ConversationSidebar delete]', err)
      toast.error('Gagal menghapus percakapan')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-coral/10">
        <span className="w-0.5 h-5 bg-coral rounded-full shrink-0" />
        <span className="font-bold text-sm tracking-tight text-coral">RuangSore</span>
      </div>

      <div className="px-3 pt-3">
        <Link
          href="/chat"
          className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Percakapan baru
        </Link>
      </div>

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
                  'flex items-center w-full rounded-md px-3 py-2 text-sm pr-8 transition-colors truncate',
                  activeId === conv.id
                    ? 'bg-coral/10 text-foreground font-medium border-l-2 border-coral'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground border-l-2 border-transparent'
                )}
              >
                <span className="truncate">{conv.title}</span>
              </Link>
              <button
                onClick={(e) => void handleDelete(e, conv.id)}
                disabled={deletingId === conv.id}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                aria-label="Hapus percakapan"
              >
                {deletingId === conv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))
        )}
      </nav>

      <MoodCalendar />

      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-indigo flex items-center justify-center">
            <span className="text-xs font-bold text-white/90 uppercase">{userEmail.charAt(0)}</span>
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
            {userEmail}
          </span>
          <button
            onClick={() => void handleSignOut()}
            className="p-1 rounded-md hover:bg-muted transition-colors shrink-0"
            aria-label="Keluar"
          >
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
