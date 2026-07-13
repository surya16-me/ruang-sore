'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const moods = [
  { value: 1, emoji: '😔', label: 'Buruk' },
  { value: 2, emoji: '😐', label: 'Biasa' },
  { value: 3, emoji: '🙂', label: 'Baik' },
  { value: 4, emoji: '😊', label: 'Seneng' },
]

interface MoodPickerProps {
  onSelect: (mood: number) => void
  className?: string
}

export function MoodPicker({ onSelect, className }: MoodPickerProps) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(value: number) {
    setSelected(value)
    onSelect(value)
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-xs text-muted-foreground">Gimana rasanya?</span>
      <div className="flex gap-1.5">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => handleSelect(m.value)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-base transition-all border',
              selected === m.value
                ? 'border-coral bg-coral/10 scale-110'
                : 'border-transparent hover:bg-muted hover:scale-105'
            )}
            aria-label={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
