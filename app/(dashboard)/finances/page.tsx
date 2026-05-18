'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Download } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { cn } from '@/lib/utils'

const MONTHLY_DATA = [
  { month: 'Ene', revenue: 8400, expenses: 5200, profit: 3200 },
  { month: 'Feb', revenue: 11200, expenses: 6800, profit: 4400 },
  { month: 'Mar', revenue: 9800, expenses: 5900, profit: 3900 },
  { month: 'Abr', revenue: 14600, expenses: 8200, profit: 6400 },
  { month: 'May', revenue: 18900, expenses: 10400, profit: 8500 },
  { month: 'Jun', revenue: 16200, expenses: 9100, profit: 7100 },
]

const EXPENSES_BREAKDOWN = [
  { label: 'Producción', amount: 28400, percentage: 51, color: '#f5f5f0' },
  { label: 'Marketing', amount: 9800, percentage: 18, color: '#c9a96e' },
  { label: 'Logística', amount: 7200, percentage: 13, color: '#60a5fa' },
  { label: 'Operaciones', amount: 6100, percentage: 11, color: '#a78bfa' },
  { label: 'Otros', amount: 3900, percentage: 7, color: '#4ade80' },
]

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-xl">
        <p className="text-[#888] text-xs mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[#888] text-xs capitalize">{p.name}:</span>
            <span className="text-[#f5f5f0] text-xs font-semibold">€{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function FinancesPage() {
  const totalRevenue = MONTHLY_DATA.reduce((a, m) => a + m.revenue, 0)
  const totalExpenses = MONTHLY_DATA.reduce((a, m) => a + m.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = Math.round((totalProfit / totalRevenue) * 100)

  const lastMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1]
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2]
  const revChange = Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)

  return (
    <div>
      <PageHeader
        title="Finanzas"
        subtitle="Resumen financiero y análisis de rentabilidad."
        actions={
          <Button variant="secondary" size="sm" icon={<Download size={13} />}>
            Exportar
          </Button>
        }
      />

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Ingresos YTD',
            value: formatCurrency(totalRevenue),
            change: 18.4,
            icon: <TrendingUp size={14} />,
          },
          {
            label: 'Gastos YTD',
            value: formatCurrency(totalExpenses),
            change: 12.1,
            icon: <TrendingDown size={14} />,
          },
          {
            label: 'Beneficio neto',
            value: formatCurrency(totalProfit),
            change: 28.7,
            icon: <TrendingUp size={14} />,
          },
          {
            label: 'Margen neto',
            value: `${profitMargin}%`,
            change: 4.2,
            icon: <Minus size={14} />,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[#444] text-xs tracking-widest uppercase">{s.label}</span>
              <span className="text-[#333]">{s.icon}</span>
            </div>
            <p className="text-[#f5f5f0] text-2xl font-bold mb-2">{s.value}</p>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-[#4ade80]" />
              <span className="text-[#4ade80] text-xs font-medium">+{s.change}%</span>
              <span className="text-[#333] text-xs">vs año anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* P&L Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-2 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#555] text-xs tracking-widest uppercase mb-1">P&L Mensual</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-[#888]">
                  <span className="w-2 h-2 rounded-full bg-[#f5f5f0]" /> Ingresos
                </span>
                <span className="flex items-center gap-1.5 text-[#888]">
                  <span className="w-2 h-2 rounded-full bg-[#f87171]" /> Gastos
                </span>
                <span className="flex items-center gap-1.5 text-[#888]">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]" /> Beneficio
                </span>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg',
              revChange >= 0 ? 'text-[#4ade80] bg-[#0d2e1a]' : 'text-[#f87171] bg-[#2e0d0d]'
            )}>
              {revChange >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {formatPercentage(revChange)} MoM
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="revenue" fill="#f5f5f0" radius={[3, 3, 0, 0]} opacity={0.9} name="ingresos" />
              <Bar dataKey="expenses" fill="#f87171" radius={[3, 3, 0, 0]} opacity={0.7} name="gastos" />
              <Bar dataKey="profit" fill="#4ade80" radius={[3, 3, 0, 0]} opacity={0.8} name="beneficio" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expenses breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
        >
          <h3 className="text-[#555] text-xs tracking-widest uppercase mb-5">Desglose gastos</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={EXPENSES_BREAKDOWN}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                strokeWidth={0}
              >
                {EXPENSES_BREAKDOWN.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {EXPENSES_BREAKDOWN.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[#888] text-xs">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#444] text-xs">{item.percentage}%</span>
                  <span className="text-[#f5f5f0] text-xs font-semibold">{formatCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-[#555] text-xs tracking-widest uppercase">Resumen mensual</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th className="text-left text-[#444] text-xs tracking-widest uppercase px-5 py-3">Mes</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">Ingresos</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">Gastos</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-4 py-3">Beneficio</th>
              <th className="text-right text-[#444] text-xs tracking-widest uppercase px-5 py-3">Margen</th>
            </tr>
          </thead>
          <tbody>
            {MONTHLY_DATA.map((row, i) => {
              const margin = Math.round((row.profit / row.revenue) * 100)
              return (
                <tr key={row.month} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3.5 text-[#888] text-sm font-medium">{row.month}</td>
                  <td className="px-4 py-3.5 text-right text-[#f5f5f0] text-sm font-semibold">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-[#f87171] text-sm">
                    {formatCurrency(row.expenses)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-[#4ade80] text-sm font-semibold">
                    {formatCurrency(row.profit)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-md',
                      margin >= 40 ? 'text-[#4ade80] bg-[#0d2e1a]' : margin >= 30 ? 'text-[#fbbf24] bg-[#2e1e0d]' : 'text-[#888] bg-[#1a1a1a]'
                    )}>
                      {margin}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#2a2a2a] bg-[#161616]">
              <td className="px-5 py-3.5 text-[#555] text-xs font-medium tracking-widest uppercase">Total</td>
              <td className="px-4 py-3.5 text-right text-[#f5f5f0] text-sm font-bold">{formatCurrency(totalRevenue)}</td>
              <td className="px-4 py-3.5 text-right text-[#f87171] text-sm font-bold">{formatCurrency(totalExpenses)}</td>
              <td className="px-4 py-3.5 text-right text-[#4ade80] text-sm font-bold">{formatCurrency(totalProfit)}</td>
              <td className="px-5 py-3.5 text-right">
                <span className="text-[#4ade80] text-xs font-bold bg-[#0d2e1a] px-2 py-0.5 rounded-md">{profitMargin}%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </motion.div>
    </div>
  )
}
