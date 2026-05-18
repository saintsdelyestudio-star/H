'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  className?: string
  index?: number
}

export default function MetricCard({
  label,
  value,
  change,
  changeLabel,
  prefix,
  suffix,
  icon,
  className,
  index = 0,
}: MetricCardProps) {
  const isPositive = (change ?? 0) > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[#555] text-xs font-medium tracking-widest uppercase">{label}</span>
        {icon && (
          <div className="text-[#333] p-1.5 rounded-lg bg-[#1a1a1a]">
            {icon}
          </div>
        )}
      </div>

      <div className="mb-3">
        <span className="text-[#888] text-lg font-light">{prefix}</span>
        <span className="text-[#f5f5f0] text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-[#888] text-lg font-light">{suffix}</span>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {isNeutral ? (
            <Minus size={12} className="text-[#555]" />
          ) : isPositive ? (
            <TrendingUp size={12} className="text-[#4ade80]" />
          ) : (
            <TrendingDown size={12} className="text-[#f87171]" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isNeutral ? 'text-[#555]' : isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'
            )}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-[#444] text-xs">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
