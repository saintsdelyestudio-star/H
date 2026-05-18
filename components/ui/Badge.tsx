import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'gold'
  | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[#1e1e1e] text-[#888] border-[#2a2a2a]',
  success: 'bg-[#0d2e1a] text-[#4ade80] border-[#14532d]',
  warning: 'bg-[#2e1e0d] text-[#fbbf24] border-[#78350f]',
  danger: 'bg-[#2e0d0d] text-[#f87171] border-[#7f1d1d]',
  info: 'bg-[#0d1e2e] text-[#60a5fa] border-[#1e3a5f]',
  gold: 'bg-[#2a1e0d] text-[#c9a96e] border-[#78501d]',
  outline: 'bg-transparent text-[#888] border-[#2a2a2a]',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[#555]',
  success: 'bg-[#4ade80]',
  warning: 'bg-[#fbbf24]',
  danger: 'bg-[#f87171]',
  info: 'bg-[#60a5fa]',
  gold: 'bg-[#c9a96e]',
  outline: 'bg-[#555]',
}

export default function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}
