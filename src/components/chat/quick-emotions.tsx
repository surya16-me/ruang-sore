import { cn } from '@/lib/utils'

const emotions = [
  { label: 'Cemas', emoji: '😰', color: 'bg-sand/20 text-sand border-sand/30 hover:bg-sand/30' },
  { label: 'Kesepian', emoji: '💔', color: 'bg-indigo/10 text-indigo border-indigo/20 hover:bg-indigo/20' },
  { label: 'Marah', emoji: '😤', color: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20' },
  { label: 'Bingung', emoji: '😕', color: 'bg-coral/10 text-coral border-coral/20 hover:bg-coral/20' },
  { label: 'Lelah', emoji: '😮‍💨', color: 'bg-muted text-muted-foreground border-border hover:bg-muted/80' },
  { label: 'Seneng', emoji: '😊', color: 'bg-sage/10 text-sage border-sage/20 hover:bg-sage/20' },
  { label: 'Sedih', emoji: '😢', color: 'bg-indigo/10 text-indigo border-indigo/20 hover:bg-indigo/20' },
  { label: 'Sendiri', emoji: '🫂', color: 'bg-coral/10 text-coral border-coral/20 hover:bg-coral/20' },
]

interface QuickEmotionsProps {
  onSelect: (emotion: string) => void
}

export function QuickEmotions({ onSelect }: QuickEmotionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
      {emotions.map((e) => (
        <button
          key={e.label}
          onClick={() => onSelect(e.label)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors',
            e.color
          )}
        >
          <span className="text-sm">{e.emoji}</span>
          {e.label}
        </button>
      ))}
    </div>
  )
}
