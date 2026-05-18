'use client'

import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-text-secondary tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-9 bg-surface2 border border-border rounded-lg',
              'text-text-primary text-sm appearance-none',
              'px-3 pr-8 cursor-pointer',
              'transition-all duration-150',
              'focus:outline-none focus:border-[#444] focus:ring-1 focus:ring-[#444]/30',
              'hover:border-[#333]',
              error && 'border-[#5a1a1a]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-surface2">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface2 text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#f87171]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
