'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Image as ImageIcon, Link, FileText, Palette, Grid, LayoutGrid } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useMoodboardStore } from '@/store/useMoodboardStore'
import type { MoodboardCategory, MoodboardItemType } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_CONFIG: Record<MoodboardCategory, { label: string; color: string }> = {
  palette: { label: 'Paleta', color: '#c9a96e' },
  texture: { label: 'Textura', color: '#888' },
  reference: { label: 'Referencia', color: '#60a5fa' },
  typography: { label: 'Tipografía', color: '#a78bfa' },
  product: { label: 'Producto', color: '#4ade80' },
  campaign: { label: 'Campaña', color: '#f472b6' },
}

const TYPE_ICONS: Record<MoodboardItemType, React.ReactNode> = {
  image: <ImageIcon size={14} />,
  link: <Link size={14} />,
  note: <FileText size={14} />,
  color: <Palette size={14} />,
  typography: <FileText size={14} />,
}

const EMPTY_FORM = {
  type: 'note' as MoodboardItemType,
  category: 'reference' as MoodboardCategory,
  title: '',
  content: '',
  notes: '',
  tags: '',
}

export default function MoodboardPage() {
  const { items, addItem, removeItem } = useMoodboardStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<MoodboardCategory | 'all'>('all')
  const [compact, setCompact] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = categoryFilter === 'all' ? items : items.filter((i) => i.category === categoryFilter)

  const handleAdd = () => {
    if (!form.content.trim()) return
    addItem({
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
    setModalOpen(false)
    setForm(EMPTY_FORM)
  }

  const renderItemContent = (item: (typeof items)[0]) => {
    if (item.type === 'color') {
      return (
        <div className="flex flex-col">
          <div
            className="w-full rounded-xl mb-3"
            style={{ background: item.content, height: compact ? 60 : 80 }}
          />
          {item.title && (
            <p className="text-[#f5f5f0] text-xs font-medium">{item.title}</p>
          )}
          <p className="text-[#555] text-[10px] font-mono mt-0.5">{item.content}</p>
        </div>
      )
    }

    if (item.type === 'link') {
      return (
        <div>
          <div className="flex items-center gap-1.5 text-[#60a5fa] text-xs mb-2">
            <Link size={10} />
            <span className="truncate">{item.content}</span>
          </div>
          {item.title && (
            <p className="text-[#f5f5f0] text-sm font-medium mb-1">{item.title}</p>
          )}
          {item.notes && (
            <p className="text-[#555] text-xs leading-relaxed line-clamp-2">{item.notes}</p>
          )}
        </div>
      )
    }

    return (
      <div>
        {item.title && (
          <p className="text-[#f5f5f0] text-sm font-semibold mb-2">{item.title}</p>
        )}
        <p className="text-[#888] text-xs leading-relaxed">{item.content}</p>
        {item.notes && (
          <p className="text-[#555] text-[10px] leading-relaxed mt-2 italic">{item.notes}</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Moodboard"
        subtitle="Referencias, paletas e inspiración creativa."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
              <button
                onClick={() => setCompact(false)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  !compact ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
                )}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setCompact(true)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  compact ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
                )}
              >
                <Grid size={13} />
              </button>
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setModalOpen(true)}>
              Añadir
            </Button>
          </div>
        }
      />

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            categoryFilter === 'all'
              ? 'bg-[#f5f5f0] text-[#0a0a0a] border-transparent'
              : 'bg-transparent text-[#555] border-[#2a2a2a] hover:text-[#f5f5f0]'
          )}
        >
          Todo ({items.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
          const count = items.filter((i) => i.category === key).length
          if (count === 0) return null
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key as MoodboardCategory)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                categoryFilter === key
                  ? 'text-[#0a0a0a] border-transparent'
                  : 'bg-transparent text-[#555] border-[#2a2a2a] hover:text-[#f5f5f0]'
              )}
              style={
                categoryFilter === key
                  ? { background: cfg.color }
                  : {}
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg.color }}
              />
              {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Masonry grid */}
      <div className={cn(
        'grid gap-3',
        compact ? 'grid-cols-4 xl:grid-cols-5' : 'grid-cols-2 xl:grid-cols-3'
      )}>
        {/* Add card */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setModalOpen(true)}
          className="bg-[#111] border border-dashed border-[#2a2a2a] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#3a3a3a] transition-colors text-[#444] hover:text-[#888] min-h-[100px]"
        >
          <Plus size={20} />
          <span className="text-xs font-medium">Añadir referencia</span>
        </motion.button>

        <AnimatePresence>
          {filtered.map((item, i) => {
            const catCfg = CATEGORY_CONFIG[item.category]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="group relative bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 hover:border-[#2a2a2a] transition-colors"
              >
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 text-[#333] hover:text-[#f87171] transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[#2e0d0d]"
                >
                  <Trash2 size={12} />
                </button>

                <div className="flex items-center gap-1.5 mb-3">
                  <span style={{ color: catCfg.color }}>{TYPE_ICONS[item.type]}</span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: catCfg.color }}
                  >
                    {catCfg.label}
                  </span>
                </div>

                {renderItemContent(item)}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#1a1a1a]">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[9px] text-[#333] px-1.5 py-0.5 rounded bg-[#1a1a1a]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && items.length > 0 && (
        <div className="text-center py-12 text-[#444] text-sm">
          No hay items en esta categoría.
        </div>
      )}

      {/* Add modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Añadir al Moodboard">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MoodboardItemType }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                <option value="note">Nota</option>
                <option value="link">Link</option>
                <option value="color">Color</option>
                <option value="typography">Tipografía</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MoodboardCategory }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                {Object.entries(CATEGORY_CONFIG).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Título (opcional)"
            placeholder="Título descriptivo..."
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label={form.type === 'color' ? 'Color (hex)' : form.type === 'link' ? 'URL' : 'Contenido'}
            placeholder={
              form.type === 'color' ? '#1a1a1a'
                : form.type === 'link' ? 'https://...'
                : 'Texto, concepto, referencia...'
            }
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          />
          <Input
            label="Notas (opcional)"
            placeholder="Notas adicionales..."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <Input
            label="Tags (separados por coma)"
            placeholder="aw25, referencia, color"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAdd} disabled={!form.content.trim()}>
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
