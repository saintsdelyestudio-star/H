'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Crown, Star, ShoppingBag, TrendingUp } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { formatCurrency, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Customer } from '@/types'

const CUSTOMERS: Customer[] = [
  {
    id: '1',
    firstName: 'Marco',
    lastName: 'Aurelio',
    email: 'marco.aurelio@gmail.com',
    country: 'ES',
    city: 'Madrid',
    tier: 'whale',
    totalOrders: 18,
    totalSpent: 2840,
    averageOrderValue: 157,
    firstOrderDate: '2024-01-12',
    lastOrderDate: '2026-05-10',
    tags: ['vip', 'early-adopter'],
  },
  {
    id: '2',
    firstName: 'Sophie',
    lastName: 'Vidal',
    email: 'sophie.vidal@icloud.com',
    country: 'FR',
    city: 'París',
    tier: 'vip',
    totalOrders: 12,
    totalSpent: 1560,
    averageOrderValue: 130,
    firstOrderDate: '2024-03-05',
    lastOrderDate: '2026-05-08',
    tags: ['vip'],
  },
  {
    id: '3',
    firstName: 'Luca',
    lastName: 'Ferreira',
    email: 'luca.f@outlook.com',
    country: 'PT',
    city: 'Lisboa',
    tier: 'vip',
    totalOrders: 9,
    totalSpent: 1170,
    averageOrderValue: 130,
    firstOrderDate: '2024-06-20',
    lastOrderDate: '2026-04-30',
    tags: ['vip', 'drop-buyer'],
  },
  {
    id: '4',
    firstName: 'Alba',
    lastName: 'Martínez',
    email: 'alba.mtz@gmail.com',
    country: 'ES',
    city: 'Barcelona',
    tier: 'regular',
    totalOrders: 5,
    totalSpent: 450,
    averageOrderValue: 90,
    firstOrderDate: '2024-09-14',
    lastOrderDate: '2026-05-02',
    tags: [],
  },
  {
    id: '5',
    firstName: 'Théo',
    lastName: 'Laurent',
    email: 'theo.laurent@me.com',
    country: 'FR',
    city: 'Lyon',
    tier: 'whale',
    totalOrders: 21,
    totalSpent: 3990,
    averageOrderValue: 190,
    firstOrderDate: '2023-12-01',
    lastOrderDate: '2026-05-12',
    tags: ['whale', 'vip', 'early-adopter'],
  },
  {
    id: '6',
    firstName: 'Mia',
    lastName: 'Chen',
    email: 'mia.chen@gmail.com',
    country: 'DE',
    city: 'Berlín',
    tier: 'regular',
    totalOrders: 4,
    totalSpent: 320,
    averageOrderValue: 80,
    firstOrderDate: '2025-01-10',
    lastOrderDate: '2026-04-15',
    tags: [],
  },
  {
    id: '7',
    firstName: 'Rafa',
    lastName: 'Solano',
    email: 'rafasolano@gmail.com',
    country: 'ES',
    city: 'Valencia',
    tier: 'new',
    totalOrders: 1,
    totalSpent: 65,
    averageOrderValue: 65,
    firstOrderDate: '2026-05-15',
    lastOrderDate: '2026-05-15',
    tags: ['new'],
  },
  {
    id: '8',
    firstName: 'Camille',
    lastName: 'Dupont',
    email: 'camille.dupont@gmail.com',
    country: 'FR',
    city: 'Marsella',
    tier: 'vip',
    totalOrders: 7,
    totalSpent: 980,
    averageOrderValue: 140,
    firstOrderDate: '2024-08-20',
    lastOrderDate: '2026-05-01',
    tags: ['vip'],
  },
]

const TIER_CONFIG = {
  whale: { label: 'Whale', variant: 'gold' as const, icon: <Crown size={10} /> },
  vip: { label: 'VIP', variant: 'info' as const, icon: <Star size={10} /> },
  regular: { label: 'Regular', variant: 'default' as const, icon: null },
  new: { label: 'Nuevo', variant: 'success' as const, icon: null },
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<'all' | 'whale' | 'vip' | 'regular' | 'new'>('all')

  const filtered = useMemo(() => {
    return CUSTOMERS.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase()
      const matchSearch = name.includes(search.toLowerCase()) || c.email.includes(search.toLowerCase())
      const matchTier = tierFilter === 'all' || c.tier === tierFilter
      return matchSearch && matchTier
    }).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [search, tierFilter])

  const stats = {
    total: CUSTOMERS.length,
    totalRevenue: CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0),
    avgLtv: Math.round(CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0) / CUSTOMERS.length),
    whales: CUSTOMERS.filter((c) => c.tier === 'whale').length,
  }

  return (
    <div>
      <PageHeader title="Clientes" subtitle="CRM — base de clientes y métricas de fidelización." />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Clientes totales', value: stats.total, icon: <ShoppingBag size={14} /> },
          { label: 'Revenue total', value: formatCurrency(stats.totalRevenue), icon: <TrendingUp size={14} /> },
          { label: 'LTV medio', value: formatCurrency(stats.avgLtv), icon: <Star size={14} /> },
          { label: 'Top clientes', value: stats.whales, icon: <Crown size={14} /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4"
          >
            <div className="text-[#333] mb-2">{s.icon}</div>
            <p className="text-[#f5f5f0] text-2xl font-bold">{s.value}</p>
            <p className="text-[#444] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Buscar cliente o email..."
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
          {(['all', 'whale', 'vip', 'regular', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors',
                tierFilter === t ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
              )}
            >
              {t === 'all' ? 'Todos' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th className="text-left text-[#444] text-xs tracking-widest uppercase px-5 py-3">Cliente</th>
              <th className="text-left text-[#444] text-xs tracking-widest uppercase px-4 py-3">Tier</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">Pedidos</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">LTV</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">AOV</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-5 py-3">Último pedido</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer, i) => {
              const tier = TIER_CONFIG[customer.tier]
              return (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#666] text-[10px] font-bold">
                          {getInitials(`${customer.firstName} ${customer.lastName}`)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[#f5f5f0] text-sm font-medium">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-[#444] text-xs">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={tier.variant}>
                      {tier.icon && <span>{tier.icon}</span>}
                      {tier.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[#888] text-sm">{customer.totalOrders}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[#f5f5f0] text-sm font-semibold">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[#888] text-sm">{formatCurrency(customer.averageOrderValue)}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-[#444] text-xs font-mono">{customer.lastOrderDate}</span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#444] text-sm">No se encontraron clientes.</div>
        )}
      </motion.div>
    </div>
  )
}
