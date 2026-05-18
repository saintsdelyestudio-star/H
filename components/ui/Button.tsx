'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'gold'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-text-primary text-background hover:bg-white active:bg-[#e0e0d8] font-medium',
  secondary:
    'bg-surface2 text-text-primary border border-border hover:bg-[#252525] active:bg-[#1e1e1e]',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface2 active:bg-[#1e1e1e]',
  destructive:
    'bg-[#3a1212] text-[#ff6b6b] border border-[#5a1a1a] hover:bg-[#4a1515] active:bg-[#3a1212]',
  outline:
    'bg-transparent text-text-primary border border-border hover:border-[#444] hover:bg-surface active:bg-surface2',
  gold:
    'bg-transparent text-gold border border-gold/30 hover:bg-gold/10 active:bg-gold/5 font-medium',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
  sm: 'h-8 px-3 text-xs rounded-lg gap-2',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-6 text-sm rounded-xl gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        className={cn(
          'inline-flex items-center justify-center font-normal tracking-wide',
          'transition-all duration-150 ease-in-out',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2',
          'select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="shrink-0">{icon}</span>
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
