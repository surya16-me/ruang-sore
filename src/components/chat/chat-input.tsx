'use client'

import { useRef, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ArrowUp, Square } from 'lucide-react'

interface ChatInputProps {
  input: string
  isLoading: boolean
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onStop: () => void
}

export function ChatInput({ input, isLoading, onChange, onSubmit, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <form
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto flex items-end gap-3 bg-muted rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring transition-shadow"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onChange}
          placeholder="Ceritain sesuatu..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-relaxed max-h-40"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors"
            aria-label="Stop"
          >
            <Square className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Kirim"
          >
            <ArrowUp className="w-4 h-4 text-primary-foreground" />
          </button>
        )}
      </form>
      <p className="text-center text-xs text-muted-foreground/60 mt-2">
        Enter untuk kirim · Shift+Enter untuk baris baru
      </p>
    </div>
  )
}
