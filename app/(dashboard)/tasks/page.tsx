'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock3,
  Trash2,
  Pencil,
  Flag,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useTaskStore } from '@/store/useTaskStore'
import type { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  shooting: '#c9a96e',
  drop: '#60a5fa',
  content: '#a78bfa',
  social: '#f472b6',
  design: '#34d399',
  admin: '#888',
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  shooting: 'Shooting',
  drop: 'Drop',
  content: 'Contenido',
  social: 'Social',
  design: 'Diseño',
  admin: 'Admin',
}

const PRIORITY_BADGES: Record<TaskPriority, { variant: 'danger' | 'warning' | 'default'; label: string }> = {
  high: { variant: 'danger', label: 'Alta' },
  medium: { variant: 'warning', label: 'Media' },
  low: { variant: 'default', label: 'Baja' },
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  todo: <Circle size={14} className="text-[#444]" />,
  'in-progress': <Clock3 size={14} className="text-[#60a5fa]" />,
  done: <CheckCircle2 size={14} className="text-[#4ade80]" />,
}

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'admin' as TaskCategory,
  priority: 'medium' as TaskPriority,
  status: 'todo' as TaskStatus,
  dueDate: '',
  assignee: '',
}

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, setStatus } = useTaskStore()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return tasks
    return tasks.filter((t) => t.status === filter)
  }, [tasks, filter])

  const openCreate = () => {
    setEditingTask(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || '',
      assignee: task.assignee || '',
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editingTask) {
      updateTask(editingTask.id, form)
    } else {
      addTask(form)
    }
    setModalOpen(false)
  }

  // Calendar
  const monthStart = startOfMonth(calendarDate)
  const monthEnd = endOfMonth(calendarDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDow = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1
  const calendarPadding = Array(startDow).fill(null)

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach((t) => {
      if (t.dueDate) {
        if (!map[t.dueDate]) map[t.dueDate] = []
        map[t.dueDate].push(t)
      }
    })
    return map
  }, [tasks])

  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }), [tasks])

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Planificación, seguimiento y calendario."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
              <button
                onClick={() => setView('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  view === 'list' ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
                )}
              >
                <List size={12} /> Lista
              </button>
              <button
                onClick={() => setView('calendar')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  view === 'calendar' ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555] hover:text-[#f5f5f0]'
                )}
              >
                <Calendar size={12} /> Calendario
              </button>
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openCreate}>
              Nueva Task
            </Button>
          </div>
        }
      />

      {/* Status filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'todo', 'in-progress', 'done'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
              filter === s
                ? 'bg-[#f5f5f0] text-[#0a0a0a] border-transparent'
                : 'bg-transparent text-[#555] border-[#2a2a2a] hover:text-[#f5f5f0] hover:border-[#3a3a3a]'
            )}
          >
            {s === 'all' ? 'Todas' : s === 'todo' ? 'Pendientes' : s === 'in-progress' ? 'En curso' : 'Completadas'}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px]',
              filter === s ? 'bg-[#0a0a0a]/20 text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#444]'
            )}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#444] text-sm">No hay tasks.</div>
            )}
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="group flex items-center gap-4 bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3.5 hover:border-[#2a2a2a] transition-colors"
              >
                <button
                  onClick={() => {
                    const next: Record<TaskStatus, TaskStatus> = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
                    setStatus(task.id, next[task.status])
                  }}
                  className="flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {STATUS_ICONS[task.status]}
                </button>

                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[task.category] }}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      task.status === 'done' ? 'line-through text-[#444]' : 'text-[#f5f5f0]'
                    )}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-[#444] text-xs mt-0.5 truncate">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="default" className="hidden sm:inline-flex">
                    {CATEGORY_LABELS[task.category]}
                  </Badge>
                  <Badge variant={PRIORITY_BADGES[task.priority].variant}>
                    <Flag size={9} />
                    {PRIORITY_BADGES[task.priority].label}
                  </Badge>
                  {task.dueDate && (
                    <span className="text-[#444] text-xs font-mono hidden lg:inline">
                      {task.dueDate}
                    </span>
                  )}
                  {task.assignee && (
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                      <span className="text-[#555] text-[9px] font-bold">
                        {task.assignee.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(task)}
                    className="p-1.5 text-[#444] hover:text-[#f5f5f0] hover:bg-[#1e1e1e] rounded-md transition-colors"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-[#444] hover:text-[#f87171] hover:bg-[#2e0d0d] rounded-md transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
          >
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#f5f5f0] font-semibold capitalize">
                {format(calendarDate, 'MMMM yyyy', { locale: es })}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
                  className="p-1.5 text-[#555] hover:text-[#f5f5f0] hover:bg-[#1e1e1e] rounded-md transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="px-2 py-1 text-[#555] hover:text-[#f5f5f0] text-xs transition-colors"
                >
                  Hoy
                </button>
                <button
                  onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
                  className="p-1.5 text-[#555] hover:text-[#f5f5f0] hover:bg-[#1e1e1e] rounded-md transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div key={d} className="text-center text-[#444] text-xs py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarPadding.map((_, i) => (
                <div key={`pad-${i}`} className="h-16 rounded-lg" />
              ))}
              {days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const dayTasks = tasksByDate[dateStr] || []
                const _today = isToday(day)
                const inMonth = isSameMonth(day, calendarDate)

                return (
                  <div
                    key={dateStr}
                    className={cn(
                      'h-16 rounded-lg p-1.5 border transition-colors',
                      _today
                        ? 'border-[#f5f5f0]/30 bg-[#1a1a1a]'
                        : 'border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-[#161616]',
                      !inMonth && 'opacity-30'
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium block text-center w-5 h-5 mx-auto rounded-full flex items-center justify-center',
                        _today ? 'bg-[#f5f5f0] text-[#0a0a0a]' : 'text-[#555]'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <div className="mt-0.5 space-y-0.5 overflow-hidden">
                      {dayTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className="text-[9px] truncate px-1 py-0.5 rounded"
                          style={{
                            background: CATEGORY_COLORS[t.category] + '22',
                            color: CATEGORY_COLORS[t.category],
                          }}
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[9px] text-[#444] px-1">+{dayTasks.length - 2}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Editar Task' : 'Nueva Task'}
      >
        <div className="space-y-4">
          <Input
            label="Título"
            placeholder="Nombre de la tarea..."
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Descripción (opcional)"
            placeholder="Descripción breve..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TaskCategory }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Prioridad</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs font-medium">Estado</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
              >
                <option value="todo">Pendiente</option>
                <option value="in-progress">En curso</option>
                <option value="done">Completada</option>
              </select>
            </div>
            <Input
              label="Fecha límite"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#888] text-xs font-medium">Asignado a</label>
            <select
              value={form.assignee}
              onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
            >
              <option value="">Sin asignar</option>
              <option value="Aimar Rodríguez">Aimar Rodríguez</option>
              <option value="Daniel Rodríguez">Daniel Rodríguez</option>
              <option value="Nil Cortés">Nil Cortés</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.title.trim()}>
              {editingTask ? 'Guardar' : 'Crear Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
