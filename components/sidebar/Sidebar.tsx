'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CheckSquare,
  Package,
  Zap,
  ShoppingBag,
  BarChart3,
  Image,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Colaboradores', href: '/collaborators', icon: UserCheck },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Inventario', href: '/inventory', icon: Package },
  { label: 'Drops', href: '/drops', icon: Zap },
  { label: 'Clientes', href: '/clients', icon: ShoppingBag },
  { label: 'Finanzas', href: '/finances', icon: BarChart3 },
  { label: 'Moodboard', href: '/moodboard', icon: Image },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-[#1e1e1e] bg-[#0a0a0a] z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[#1e1e1e]">
        <div className="w-8 h-8 rounded-full bg-[#f5f5f0] flex items-center justify-center flex-shrink-0">
          <span className="text-[#0a0a0a] font-bold text-xs tracking-tight">SD</span>
        </div>
        <div>
          <p className="text-[#f5f5f0] font-semibold text-sm tracking-wide">Delyé</p>
          <p className="text-[#555] text-[10px] tracking-widest uppercase">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-[#f5f5f0] text-[#0a0a0a]'
                    : 'text-[#666] hover:text-[#f5f5f0] hover:bg-[#161616]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[#f5f5f0] rounded-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon
                  size={15}
                  className={cn(
                    'relative z-10 flex-shrink-0',
                    isActive ? 'text-[#0a0a0a]' : ''
                  )}
                />
                <span className={cn('relative z-10 font-medium', isActive ? 'text-[#0a0a0a]' : '')}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight size={12} className="relative z-10 ml-auto text-[#0a0a0a] opacity-50" />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1e1e1e]">
        <motion.div
          whileHover={{ x: 2 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#555] hover:text-[#f5f5f0] hover:bg-[#161616] cursor-pointer transition-colors text-sm"
        >
          <Settings size={15} />
          <span className="font-medium">Ajustes</span>
        </motion.div>
        <div className="mt-3 px-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#1e1e1e] flex items-center justify-center">
              <span className="text-[#888] text-[9px] font-bold">AR</span>
            </div>
            <span className="text-[#444] text-xs">v0.1.0</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
