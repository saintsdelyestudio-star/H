'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface ProductStock {
  id: string
  name: string
  sku: string
  category: string
  drop: string
  price: number
  stock: Record<string, number>
  totalStock: number
  status: 'active' | 'low' | 'out'
}

const PRODUCTS: ProductStock[] = [
  {
    id: '1',
    name: 'Hoodie Essential Noir',
    sku: 'DL-HD-001-BLK',
    category: 'Hoodie',
    drop: 'SS25',
    price: 90,
    stock: { XS: 4, S: 12, M: 18, L: 14, XL: 8, XXL: 3 },
    totalStock: 59,
    status: 'active',
  },
  {
    id: '2',
    name: 'Tee Oversized Off-White',
    sku: 'DL-TS-001-OW',
    category: 'Tee',
    drop: 'SS25',
    price: 65,
    stock: { XS: 2, S: 4, M: 6, L: 3, XL: 1, XXL: 0 },
    totalStock: 16,
    status: 'low',
  },
  {
    id: '3',
    name: 'Cargo Pant Charcoal',
    sku: 'DL-PT-001-CHR',
    category: 'Pantalón',
    drop: 'AW24',
    price: 130,
    stock: { XS: 0, S: 2, M: 5, L: 7, XL: 4, XXL: 1 },
    totalStock: 19,
    status: 'active',
  },
  {
    id: '4',
    name: 'Bomber Satin Noir',
    sku: 'DL-JK-001-BLK',
    category: 'Jacket',
    drop: 'AW24',
    price: 190,
    stock: { XS: 0, S: 1, M: 2, L: 1, XL: 0, XXL: 0 },
    totalStock: 4,
    status: 'low',
  },
  {
    id: '5',
    name: 'Cap SD Logo',
    sku: 'DL-CP-001-BLK',
    category: 'Accesorio',
    drop: 'Basics',
    price: 30,
    stock: { XS: 0, S: 0, M: 45, L: 38, XL: 22, XXL: 0 },
    totalStock: 105,
    status: 'active',
  },
  {
    id: '6',
    name: 'Tee Washed Grey',
    sku: 'DL-TS-002-GRY',
    category: 'Tee',
    drop: 'SS25',
    price: 60,
    stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    totalStock: 0,
    status: 'out',
  },
  {
    id: '7',
    name: 'Sweatpant Essential',
    sku: 'DL-SW-001-BLK',
    category: 'Pantalón',
    drop: 'SS25',
    price: 85,
    stock: { XS: 5, S: 9, M: 14, L: 11, XL: 6, XXL: 2 },
    totalStock: 47,
    status: 'active',
  },
  {
    id: '8',
    name: 'Tote Bag Noir',
    sku: 'DL-BG-001-BLK',
    category: 'Accesorio',
    drop: 'Basics',
    price: 45,
    stock: { XS: 0, S: 0, M: 3, L: 0, XL: 0, XXL: 0 },
    totalStock: 3,
    status: 'low',
  },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const getStockColor = (qty: number) => {
  if (qty === 0) return 'text-[#f87171]'
  if (qty <= 3) return 'text-[#fbbf24]'
  return 'text-[#4ade80]'
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchFilter =
        filter === 'all' ? true : filter === 'low' ? p.status === 'low' : p.status === 'out'
      return matchSearch && matchFilter
    })
  }, [search, filter])

  const stats = useMemo(() => ({
    total: PRODUCTS.reduce((a, p) => a + p.totalStock, 0),
    low: PRODUCTS.filter((p) => p.status === 'low').length,
    out: PRODUCTS.filter((p) => p.status === 'out').length,
    active: PRODUCTS.filter((p) => p.status === 'active').length,
  }), [])

  return (
    <div>
      <PageHeader title="Inventario" subtitle="Stock en tiempo real de todos los productos." />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Unidades totales', value: stats.total, icon: <Package size={14} />, color: 'text-[#f5f5f0]' },
          { label: 'Productos activos', value: stats.active, icon: <CheckCircle size={14} />, color: 'text-[#4ade80]' },
          { label: 'Stock bajo', value: stats.low, icon: <AlertTriangle size={14} />, color: 'text-[#fbbf24]' },
          { label: 'Agotados', value: stats.out, icon: <TrendingDown size={14} />, color: 'text-[#f87171]' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4"
          >
            <div className={cn('mb-2', s.color)}>{s.icon}</div>
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[#444] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Buscar producto o SKU..."
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === f ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
              )}
            >
              {f === 'all' ? 'Todos' : f === 'low' ? 'Stock bajo' : 'Agotados'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th className="text-left text-[#444] text-xs font-medium tracking-widest uppercase px-5 py-3">Producto</th>
              <th className="text-left text-[#444] text-xs font-medium tracking-widest uppercase px-4 py-3">Drop</th>
              <th className="text-left text-[#444] text-xs font-medium tracking-widest uppercase px-4 py-3">Estado</th>
              {SIZES.map((s) => (
                <th key={s} className="text-center text-[#333] text-xs font-medium px-2 py-3">{s}</th>
              ))}
              <th className="text-right text-[#444] text-xs font-medium tracking-widest uppercase px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-[#f5f5f0] text-sm font-medium">{product.name}</p>
                    <p className="text-[#444] text-xs mt-0.5 font-mono">{product.sku}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant="default">{product.drop}</Badge>
                </td>
                <td className="px-4 py-3.5">
                  {product.status === 'active' && <Badge variant="success" dot>Activo</Badge>}
                  {product.status === 'low' && <Badge variant="warning" dot>Stock bajo</Badge>}
                  {product.status === 'out' && <Badge variant="danger" dot>Agotado</Badge>}
                </td>
                {SIZES.map((size) => (
                  <td key={size} className="px-2 py-3.5 text-center">
                    <span className={cn('text-sm font-mono', getStockColor(product.stock[size] || 0))}>
                      {product.stock[size] ?? '—'}
                    </span>
                  </td>
                ))}
                <td className="px-5 py-3.5 text-right">
                  <span className={cn('text-sm font-bold', getStockColor(product.totalStock))}>
                    {product.totalStock}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#444] text-sm">
            No se encontraron productos.
          </div>
        )}
      </motion.div>
    </div>
  )
}
