'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, glass = false, padding = 'md', children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
        className={cn(
          'rounded-2xl border border-border',
          glass
            ? 'bg-surface/70 backdrop-blur-md'
            : 'bg-surface',
          hoverable && 'cursor-pointer transition-shadow duration-200 hover:shadow-card-hover hover:border-[#333]',
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('flex items-center justify-between mb-5', className)}>
    {children}
  </div>
)

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <h3 className={cn('text-sm font-medium text-text-secondary tracking-wide uppercase', className)}>
    {children}
  </h3>
)

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <div className={cn('', className)}>{children}</div>

export default Card
