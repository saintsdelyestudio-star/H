'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      {icon && (
        <div className="text-[#333] mb-4 p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
          {icon}
        </div>
      )}
      <h3 className="text-[#f5f5f0] font-medium text-sm mb-1">{title}</h3>
      {description && (
        <p className="text-[#555] text-xs max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
