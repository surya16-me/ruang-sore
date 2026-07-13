'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MoodEntry {
  date: string
  mood: number
}

const MOOD_COLORS: Record<number, string> = {
  1: 'bg-coral',
  2: 'bg-sand',
  3: 'bg-sage',
  4: 'bg-indigo',
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Buruk',
  2: 'Biasa',
  3: 'Baik',
  4: 'Seneng',
}

export function MoodCalendar() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/mood')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  function getMood(date: Date): MoodEntry | undefined {
    const key = date.toISOString().slice(0, 10)
    return entries.find((e) => e.date === key)
  }

  return (
    <div className="px-3 py-3 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground mb-2">Mood 7 hari</p>
      {isLoading ? (
        <div className="text-xs text-muted-foreground">Memuat...</div>
      ) : (
        <div className="flex gap-1">
          {days.map((d) => {
            const entry = getMood(d)
            const isToday = d.toDateString() === today.toDateString()
            const key = d.toISOString().slice(0, 10)
            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setShowTooltip(key)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium transition-colors',
                    entry
                      ? MOOD_COLORS[entry.mood]
                      : 'bg-muted text-muted-foreground',
                    isToday && 'ring-2 ring-ring ring-offset-1 ring-offset-sidebar'
                  )}
                >
                  {d.getDate()}
                </div>
                {showTooltip === key && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-foreground text-background text-[10px] whitespace-nowrap z-10">
                    {d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })}
                    {entry && ` · ${MOOD_LABELS[entry.mood]}`}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
