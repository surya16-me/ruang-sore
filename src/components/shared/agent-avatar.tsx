import { cn } from '@/lib/utils'

interface AgentAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<NonNullable<AgentAvatarProps['size']>, string> = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-9 h-9 text-lg',
  lg: 'w-16 h-16 text-3xl',
}

export function AgentAvatar({ size = 'sm', className }: AgentAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-amber-100 flex items-center justify-center shrink-0 select-none',
        sizeMap[size],
        className
      )}
    >
      🌇
    </div>
  )
}
