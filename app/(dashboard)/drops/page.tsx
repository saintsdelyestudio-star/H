'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Zap,
  Calendar,
  TrendingUp,
  Package,
  MoreHorizontal,
  X,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Drop, DropStatus } from '@/types'

const STATUS_CONFIG: Record<DropStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'default' | 'danger' | 'gold'; dot: boolean }> = {
  planning: { label: 'Planificación', variant: 'default', dot: true },
  upcoming: { label: 'Próximo', variant: 'info', dot: true },
  live: { label: 'Live', variant: 'success', dot: true },
  'sold-out': { label: 'Sold Out', variant: 'gold', dot: false },
  archived: { label: 'Archivado', variant: 'default', dot: false },
}

const MOCK_DROPS: Drop[] = [
  {
    id: '1',
    name: 'SS25 — Silence',
    season: 'SS',
    year: 2025,
    status: 'live',
    releaseDate: '2025-03-15',
    totalRevenue: 42800,
    totalUnits: 340,
    unitsSold: 298,
    description:
      'Primera colección de 2025. Silencio como estética. Minimalismo radical con siluetas limpias y materiales premium.',
    products: ['1', '2', '7'],
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    name: 'AW24 — Brutalismo',
    season: 'AW',
    year: 2024,
    status: 'sold-out',
    releaseDate: '2024-09-20',
    endDate: '2024-12-31',
    totalRevenue: 38400,
    totalUnits: 280,
    unitsSold: 280,
    description:
      'Colección de otoño-invierno 2024. Arquitectura brutalista como inspiración. Tejidos técnicos y cortes estructurados.',
    products: ['3', '4'],
    createdAt: '2024-05-01',
  },
  {
    id: '3',
    name: 'SD Basics',
    season: 'Year-Round',
    year: 2024,
    status: 'live',
    releaseDate: '2024-06-01',
    totalRevenue: 18200,
    totalUnits: 600,
    unitsSold: 480,
    description:
      'Colección permanente de básicos Delyé. Prendas atemporales que definen el armario esencial.',
    products: ['5', '8'],
    createdAt: '2024-04-01',
  },
  {
    id: '4',
    name: 'AW25 — Industrial',
    season: 'AW',
    year: 2025,
    status: 'planning',
    releaseDate: '2025-09-01',
    totalRevenue: 0,
    totalUnits: 0,
    unitsSold: 0,
    description: 'Próxima colección de otoño-invierno. En fase de desarrollo y muestrario.',
    products: [],
    createdAt: '2025-01-15',
  },
  {
    id: '5',
    name: 'Capsule #001',
    season: 'Capsule',
    year: 2025,
    status: 'upcoming',
    releaseDate: '2025-07-10',
    totalRevenue: 0,
    totalUnits: 120,
    unitsSold: 0,
    description: 'Primera cápsula limitada. Pieza única de 120 unidades numeradas.',
    products: [],
    createdAt: '2025-03-01',
  },
]

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>(MOCK_DROPS)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailDrop, setDetailDrop] = useState<Drop | null>(null)
  const [form, setForm] = useState({
    name: '',
    season: '',
    year: new Date().getFullYear(),
    status: 'planning' as DropStatus,
    releaseDate: '',
    description: '',
  })

  const handleAdd = () => {
    const newDrop: Drop = {
      id: Date.now().toString(),
      name: form.name,
      season: form.season,
      year: form.year,
      status: form.status,
      releaseDate: form.releaseDate,
      totalRevenue: 0,
      totalUnits: 0,
      unitsSold: 0,
      description: form.description,
      products: [],
      createdAt: new Date().toISOString(),
    }
    setDrops((prev) => [newDrop, ...prev])
    setModalOpen(false)
    setForm({ name: '', season: '', year: new Date().getFullYear(), status: 'planning', releaseDate: '', description: '' })
  }

  const totalRevenue = drops.reduce((a, d) => a + d.totalRevenue, 0)
  const totalSold = drops.reduce((a, d) => a + d.unitsSold, 0)

  return (
    <div>
      <PageHeader
        title="Drops & Colecciones"
        subtitle="Gestión de lanzamientos y colecciones."
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setModalOpen(true)}>
            Nuevo Drop
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Revenue total', value: formatCurrency(totalRevenue), icon: <TrendingUp size={14} /> },
          { label: 'Unidades vendidas', value: totalSold.toLocaleString(), icon: <Package size={14} /> },
          { label: 'Drops activos', value: drops.filter((d) => d.status === 'live').length, icon: <Zap size={14} /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#444] text-xs tracking-widest uppercase">{s.label}</span>
              <span className="text-[#333]">{s.icon}</span>
            </div>
            <p className="text-[#f5f5f0] text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Drops grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AnimatePresence>
          {drops.map((drop, i) => {
            const cfg = STATUS_CONFIG[drop.status]
            const pct = drop.totalUnits > 0 ? Math.round((drop.unitsSold / drop.totalUnits) * 100) : 0

            return (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 cursor-pointer hover:border-[#2a2a2a] transition-colors"
                onClick={() => setDetailDrop(drop)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>
                    </div>
                    <h3 className="text-[#f5f5f0] font-semibold text-base">{drop.name}</h3>
                    <p className="text-[#444] text-xs mt-0.5">{drop.season} {drop.year}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation() }}
                    className="text-[#333] hover:text-[#666] p-1 rounded-md hover:bg-[#1e1e1e] transition-colors"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {drop.description && (
                  <p className="text-[#555] text-xs leading-relaxed mb-4 line-clamp-2">
                    {drop.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#1a1a1a] rounded-xl p-3">
                    <p className="text-[#f5f5f0] font-bold text-base">{formatCurrency(drop.totalRevenue)}</p>
                    <p className="text-[#444] text-[10px] mt-0.5">Revenue</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-xl p-3">
                    <p className="text-[#f5f5f0] font-bold text-base">
                      {drop.unitsSold}<span className="text-[#444] font-normal text-sm">/{drop.totalUnits}</span>
                    </p>
                    <p className="text-[#444] text-[10px] mt-0.5">Unidades vendidas</p>
                  </div>
                </div>

                {drop.totalUnits > 0 && (
                  <div>
                    <div className="flex justify-between text-[10px] text-[#444] mb-1.5">
                      <span>Sell-through</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                        className={cn(
                          'h-full rounded-full',
                          pct >= 90 ? 'bg-[#4ade80]' : pct >= 50 ? 'bg-[#f5f5f0]' : 'bg-[#888]'
                        )}
                      />
                    </div>
                  </div>
                )}

                {drop.releaseDate && (
                  <div className="flex items-center gap-1.5 text-[#444] text-xs mt-4 pt-3 border-t border-[#1a1a1a]">
                    <Calendar size={11} />
                    <span>
                      {drop.status === 'planning' || drop.status === 'upcoming' ? 'Lanzamiento: ' : 'Lanzado: '}
                      {drop.releaseDate}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Drop detail modal */}
      <AnimatePresence>
        {detailDrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDetailDrop(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#111] border border-[#222] rounded-2xl shadow-2xl p-6"
            >
              <button
                onClick={() => setDetailDrop(null)}
                className="absolute top-4 right-4 text-[#555] hover:text-[#f5f5f0] transition-colors"
              >
                <X size={16} />
              </button>
              <Badge variant={STATUS_CONFIG[detailDrop.status].variant} dot={STATUS_CONFIG[detailDrop.status].dot} className="mb-3">
                {STATUS_CONFIG[detailDrop.status].label}
              </Badge>
              <h2 className="text-[#f5f5f0] text-xl font-semibold mb-1">{detailDrop.name}</h2>
              <p className="text-[#555] text-sm mb-4">{detailDrop.season} {detailDrop.year}</p>
              {detailDrop.description && (
                <p className="text-[#888] text-sm leading-relaxed mb-5">{detailDrop.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                  <p className="text-[#f5f5f0] font-bold text-xl">{formatCurrency(detailDrop.totalRevenue)}</p>
                  <p className="text-[#444] text-xs mt-1">Revenue total</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                  <p className="text-[#f5f5f0] font-bold text-xl">{detailDrop.unitsSold}</p>
                  <p className="text-[#444] text-xs mt-1">Unidades vendidas</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New drop modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Drop">
        <div className="space-y-4">
          <Input
            label="Nombre del drop"
            placeholder="SS25 — Nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Temporada"
              placeholder="SS, AW, Capsule..."
              value={form.season}
              onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Estado</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DropStatus }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                <option value="planning">Planificación</option>
                <option value="upcoming">Próximo</option>
                <option value="live">Live</option>
                <option value="sold-out">Sold Out</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
          <Input
            label="Fecha de lanzamiento"
            type="date"
            value={form.releaseDate}
            onChange={(e) => setForm((f) => ({ ...f, releaseDate: e.target.value }))}
          />
          <Input
            label="Descripción"
            placeholder="Concepto del drop..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAdd} disabled={!form.name.trim()}>
              Crear Drop
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
