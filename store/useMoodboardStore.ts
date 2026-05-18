'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { MoodboardItem, MoodboardCategory } from '@/types'

interface MoodboardStore {
  items: MoodboardItem[]
  addItem: (item: Omit<MoodboardItem, 'id' | 'createdAt'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<MoodboardItem>) => void
  getByCategory: (category: MoodboardCategory) => MoodboardItem[]
}

const now = new Date().toISOString()

const SEED_ITEMS: MoodboardItem[] = [
  {
    id: uuidv4(),
    type: 'note',
    category: 'reference',
    title: 'AW25 — Concepto',
    content: 'Silencio industrial. Arquitectura brutalista. Prendas que perduran.',
    notes: 'El mood es austeridad radical con detalles inesperados.',
    tags: ['aw25', 'concepto'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'color',
    category: 'palette',
    title: 'Paleta AW25',
    content: '#1a1a1a',
    notes: 'Negro carbón — base de la colección',
    tags: ['color', 'aw25'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'color',
    category: 'palette',
    title: 'Off-white',
    content: '#f0ede8',
    notes: 'Blanco roto cálido para contraste',
    tags: ['color', 'aw25'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'color',
    category: 'palette',
    title: 'Tierra',
    content: '#8b6f4e',
    notes: 'Tono tierra para accesorios',
    tags: ['color', 'aw25'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'link',
    category: 'reference',
    title: 'Inspiración — Acne Studios AW23',
    content: 'https://www.acnestudios.com',
    notes: 'Siluetas oversize, layering minimalista',
    tags: ['referencia', 'acne'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'note',
    category: 'campaign',
    title: 'Concepto campaña SS25',
    content: 'Luz de amanecer. Texturas naturales. Quietud activa.',
    notes: 'Fotografía analógica, grano visible, paleta cálida.',
    tags: ['ss25', 'campaña'],
    createdAt: now,
  },
  {
    id: uuidv4(),
    type: 'note',
    category: 'typography',
    title: 'Dirección tipográfica',
    content: 'Grotesca moderna + serif elegante para titulares',
    notes: 'Inter para UI, posible Canela o editoral serif para campaña',
    tags: ['tipo', 'branding'],
    createdAt: now,
  },
]

export const useMoodboardStore = create<MoodboardStore>()(
  persist(
    (set, get) => ({
      items: SEED_ITEMS,

      addItem: (itemData) => {
        const item: MoodboardItem = {
          ...itemData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ items: [item, ...state.items] }))
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }))
      },

      getByCategory: (category) => {
        return get().items.filter((i) => i.category === category)
      },
    }),
    { name: 'delye-moodboard' }
  )
)
