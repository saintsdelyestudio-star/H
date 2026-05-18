'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import MetricCard from '@/components/shared/MetricCard'
import { formatCurrency } from '@/lib/utils'

const SALES_DATA = [
  { month: 'Ene', revenue: 8400, orders: 42 },
  { month: 'Feb', revenue: 11200, orders: 58 },
  { month: 'Mar', revenue: 9800, orders: 51 },
  { month: 'Abr', revenue: 14600, orders: 74 },
  { month: 'May', revenue: 18900, orders: 96 },
  { month: 'Jun', revenue: 16200, orders: 83 },
]

const TOP_PRODUCTS = [
  { name: 'Hoodie Essential Noir', units: 142, revenue: 12780, drop: 'SS25' },
  { name: 'Tee Oversized Off-White', units: 98, revenue: 6370, drop: 'SS25' },
  { name: 'Cargo Pant Charcoal', units: 67, revenue: 8710, drop: 'AW24' },
  { name: 'Bomber Satin Noir', units: 54, revenue: 10260, drop: 'AW24' },
  { name: 'Cap SD Logo', units: 201, revenue: 6030, drop: 'Basics' },
]

const RECENT_ORDERS = [
  {
    id: '#DL-2847',
    customer: 'Marco Aurelio',
    product: 'Hoodie Essential Noir — M',
    amount: 90,
    status: 'fulfilled',
    time: '2h ago',
    country: 'ES',
  },
  {
    id: '#DL-2846',
    customer: 'Sophie Vidal',
    product: 'Tee Oversized Off-White — S',
    amount: 65,
    status: 'processing',
    time: '4h ago',
    country: 'FR',
  },
  {
    id: '#DL-2845',
    customer: 'Luca Ferreira',
    product: 'Cargo Pant Charcoal — L',
    amount: 130,
    status: 'fulfilled',
    time: '6h ago',
    country: 'PT',
  },
  {
    id: '#DL-2844',
    customer: 'Alba Martínez',
    product: 'Cap SD Logo',
    amount: 30,
    status: 'shipped',
    time: '8h ago',
    country: 'ES',
  },
  {
    id: '#DL-2843',
    customer: 'Théo Laurent',
    product: 'Bomber Satin Noir — M',
    amount: 190,
    status: 'fulfilled',
    time: '12h ago',
    country: 'FR',
  },
]

const STATUS_STYLES: Record<string, string> = {
  fulfilled: 'text-[#4ade80] bg-[#0d2e1a]',
  processing: 'text-[#fbbf24] bg-[#2e1e0d]',
  shipped: 'text-[#60a5fa] bg-[#0d1e2e]',
  pending: 'text-[#888] bg-[#1a1a1a]',
  cancelled: 'text-[#f87171] bg-[#2e0d0d]',
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-xl">
        <p className="text-[#888] text-xs mb-1">{label}</p>
        <p className="text-[#f5f5f0] font-semibold text-sm">€{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const totalRevenue = SALES_DATA.reduce((a, b) => a + b.revenue, 0)
  const totalOrders = SALES_DATA.reduce((a, b) => a + b.orders, 0)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <p className="text-[#444] text-xs tracking-widest uppercase mb-1 capitalize">{today}</p>
        <h1 className="text-[#f5f5f0] text-2xl font-semibold tracking-tight">
          Bienvenido, <span className="text-gradient">Delyé</span>
        </h1>
        <p className="text-[#555] text-sm mt-1">Resumen de operaciones en tiempo real.</p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Ingresos Totales"
          value={formatCurrency(totalRevenue)}
          change={18.4}
          changeLabel="vs mes anterior"
          icon={<TrendingUp size={14} />}
          index={0}
        />
        <MetricCard
          label="Pedidos Totales"
          value={totalOrders}
          change={12.1}
          changeLabel="vs mes anterior"
          icon={<ShoppingBag size={14} />}
          index={1}
        />
        <MetricCard
          label="Ticket Medio"
          value={formatCurrency(Math.round(totalRevenue / totalOrders))}
          change={5.3}
          changeLabel="vs mes anterior"
          icon={<Package size={14} />}
          index={2}
        />
        <MetricCard
          label="Clientes Nuevos"
          value="284"
          change={22.7}
          changeLabel="este mes"
          icon={<Users size={14} />}
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-2 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#555] text-xs font-medium tracking-widest uppercase">Ventas</h3>
              <p className="text-[#f5f5f0] text-xl font-bold mt-0.5">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#4ade80] bg-[#0d2e1a] px-2.5 py-1 rounded-lg text-xs font-medium">
              <TrendingUp size={11} />
              +18.4% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={SALES_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5f5f0" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f5f5f0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#444', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#444', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f5f5f0"
                strokeWidth={1.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#f5f5f0', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
        >
          <h3 className="text-[#555] text-xs font-medium tracking-widest uppercase mb-5">
            Top Productos
          </h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="text-[#333] text-xs font-mono w-4 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#d4d4d4] text-xs font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-[#444] text-[10px] mt-0.5">
                    {product.units} uds — {product.drop}
                  </p>
                </div>
                <span className="text-[#f5f5f0] text-xs font-semibold flex-shrink-0">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#555] text-xs font-medium tracking-widest uppercase">
            Pedidos Recientes
          </h3>
          <button className="text-[#555] hover:text-[#f5f5f0] text-xs font-medium flex items-center gap-1 transition-colors">
            Ver todos <ArrowUpRight size={11} />
          </button>
        </div>
        <div className="space-y-1">
          {RECENT_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#161616] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                <span className="text-[#555] text-[10px] font-bold">{order.country}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#f5f5f0] text-sm font-medium">{order.customer}</span>
                  <span className="text-[#333] text-xs font-mono">{order.id}</span>
                </div>
                <p className="text-[#444] text-xs truncate mt-0.5">{order.product}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${STATUS_STYLES[order.status] || ''}`}
                >
                  {order.status}
                </span>
                <span className="text-[#f5f5f0] text-sm font-semibold">
                  €{order.amount}
                </span>
                <div className="flex items-center gap-1 text-[#333] text-xs">
                  <Clock size={10} />
                  {order.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
