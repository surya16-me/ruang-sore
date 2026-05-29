import { AgentAvatar } from '@/components/shared/agent-avatar'

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 pt-20 pb-10 text-center">
      <AgentAvatar size="lg" />
      <div>
        <p className="font-semibold">Halo, aku RuangSore</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
          Aku di sini buat dengerin kamu — tanpa menghakimi. Cerita aja apa
          yang lagi kamu rasain.
        </p>
      </div>
    </div>
  )
}
