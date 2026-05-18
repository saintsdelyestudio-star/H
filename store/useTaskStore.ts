'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskStatus, TaskCategory, TaskPriority } from '@/types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setStatus: (id: string, status: TaskStatus) => void
  getTasksByDate: (date: string) => Task[]
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTasksByCategory: (category: TaskCategory) => Task[]
}

const now = new Date().toISOString()

const SEED_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: 'Shooting AW25 lookbook',
    description: 'Sesión fotográfica principal para la colección otoño-invierno 2025.',
    category: 'shooting',
    priority: 'high',
    status: 'todo',
    assignee: 'Aimar Rodríguez',
    dueDate: '2026-06-10',
    createdAt: now,
    updatedAt: now,
    tags: ['lookbook', 'aw25'],
  },
  {
    id: uuidv4(),
    title: 'Campaña Instagram SS25',
    description: 'Planificación y publicación de contenido para la campaña de primavera-verano.',
    category: 'social',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Daniel Rodríguez',
    dueDate: '2026-05-28',
    createdAt: now,
    updatedAt: now,
    tags: ['instagram', 'ss25', 'campaign'],
  },
  {
    id: uuidv4(),
    title: 'Diseño drop capsule verano',
    description: 'Definir siluetas, materiales y colorways para la cápsula de verano.',
    category: 'design',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Aimar Rodríguez',
    dueDate: '2026-05-25',
    createdAt: now,
    updatedAt: now,
    tags: ['design', 'capsule'],
  },
  {
    id: uuidv4(),
    title: 'Actualizar fichas de producto Shopify',
    description: 'Revisar y actualizar descripciones, imágenes y tallas en la tienda.',
    category: 'admin',
    priority: 'medium',
    status: 'todo',
    assignee: 'Daniel Rodríguez',
    dueDate: '2026-05-30',
    createdAt: now,
    updatedAt: now,
    tags: ['shopify', 'admin'],
  },
  {
    id: uuidv4(),
    title: 'Producción vídeo Reels x3',
    description: 'Tres vídeos cortos para Reels: producto, behind the scenes, lifestyle.',
    category: 'content',
    priority: 'medium',
    status: 'todo',
    assignee: 'Nil Cortés',
    dueDate: '2026-06-05',
    createdAt: now,
    updatedAt: now,
    tags: ['reels', 'video'],
  },
  {
    id: uuidv4(),
    title: 'Confirmar fábrica para AW25',
    description: 'Validar muestras, cantidades y fechas de entrega con el fabricante.',
    category: 'admin',
    priority: 'high',
    status: 'done',
    assignee: 'Aimar Rodríguez',
    dueDate: '2026-05-15',
    createdAt: now,
    updatedAt: now,
    tags: ['production', 'aw25'],
  },
  {
    id: uuidv4(),
    title: 'Preparar drop SS25 launch',
    description: 'Configurar página de drop, notificaciones, email marketing.',
    category: 'drop',
    priority: 'high',
    status: 'done',
    assignee: 'Daniel Rodríguez',
    dueDate: '2026-04-20',
    createdAt: now,
    updatedAt: now,
    tags: ['ss25', 'launch'],
  },
  {
    id: uuidv4(),
    title: 'Moodboard colección cápsula',
    description: 'Recopilar referencias visuales para la próxima cápsula.',
    category: 'design',
    priority: 'low',
    status: 'todo',
    assignee: 'Aimar Rodríguez',
    dueDate: '2026-06-15',
    createdAt: now,
    updatedAt: now,
    tags: ['moodboard', 'design'],
  },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: SEED_TASKS,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [task, ...state.tasks] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },

      setStatus: (id, status) => {
        get().updateTask(id, { status })
      },

      getTasksByDate: (date) => {
        return get().tasks.filter((t) => t.dueDate === date)
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((t) => t.status === status)
      },

      getTasksByCategory: (category) => {
        return get().tasks.filter((t) => t.category === category)
      },
    }),
    {
      name: 'delye-tasks',
    }
  )
)
