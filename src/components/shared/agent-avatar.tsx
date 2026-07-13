import { cn } from '@/lib/utils'

interface AgentAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<NonNullable<AgentAvatarProps['size']>, string> = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-16 h-16',
}

export function AgentAvatar({ size = 'sm', className }: AgentAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full shrink-0 select-none overflow-hidden',
        sizeMap[size],
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E07A5F" />
            <stop offset="100%" stopColor="#F2CC8F" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#avatarGrad)" />
        <text
          x="50"
          y="53"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="700"
          fontSize="36"
          fill="white"
          letterSpacing="-1"
        >
          RS
        </text>
      </svg>
    </div>
  )
}
