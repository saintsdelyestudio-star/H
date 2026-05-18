import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[#888] text-xs font-medium">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">{icon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors',
              icon && 'pl-9',
              error && 'border-[#7f1d1d]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[#f87171] text-xs">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
