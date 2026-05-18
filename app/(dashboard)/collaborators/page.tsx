'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Instagram, Globe, MapPin, Star, X, Camera, Video, Palette, Pencil } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

interface Collaborator {
  id: string
  name: string
  role: string
  roleIcon: string
  description: string
  location: string
  instagram?: string
  portfolio?: string
  tags: string[]
  featured: boolean
  projects: string[]
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  photographer: <Camera size={14} />,
  videographer: <Video size={14} />,
  'art-director': <Palette size={14} />,
  stylist: <Star size={14} />,
  'graphic-designer': <Pencil size={14} />,
}

const INITIAL_COLLABS: Collaborator[] = [
  {
    id: '1',
    name: 'Nil Cortés',
    role: 'photographer',
    roleIcon: 'photographer',
    description:
      'Fotógrafo y director creativo. Responsable de la identidad visual de las campañas de Delyé. Su estilo mezcla el minimalismo con la crudeza urbana.',
    location: 'Barcelona, ES',
    instagram: '@nilcortes',
    portfolio: 'nilcortes.com',
    tags: ['editorial', 'campaign', 'lookbook', 'lifestyle'],
    featured: true,
    projects: ['SS25 Campaign', 'AW24 Lookbook', 'SD Capsule'],
  },
]

const ROLE_LABELS: Record<string, string> = {
  photographer: 'Fotógrafo',
  videographer: 'Videógrafo',
  'art-director': 'Director de Arte',
  stylist: 'Estilista',
  'graphic-designer': 'Diseñador Gráfico',
  model: 'Modelo',
  marketing: 'Marketing',
  pr: 'PR',
  other: 'Otro',
}

export default function CollaboratorsPage() {
  const [collabs, setCollabs] = useState<Collaborator[]>(INITIAL_COLLABS)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: 'photographer',
    description: '',
    location: '',
    instagram: '',
    portfolio: '',
    tags: '',
  })

  const handleAdd = () => {
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: form.name,
      role: form.role,
      roleIcon: form.role,
      description: form.description,
      location: form.location,
      instagram: form.instagram,
      portfolio: form.portfolio,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: false,
      projects: [],
    }
    setCollabs((prev) => [...prev, newCollab])
    setModalOpen(false)
    setForm({ name: '', role: 'photographer', description: '', location: '', instagram: '', portfolio: '', tags: '' })
  }

  const handleRemove = (id: string) => {
    setCollabs((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Colaboradores"
        subtitle="Creativos que dan vida a Delyé."
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={13} />}
            onClick={() => setModalOpen(true)}
          >
            Añadir
          </Button>
        }
      />

      {/* Featured collaborator */}
      {collabs.filter((c) => c.featured).map((collab, i) => (
        <motion.div
          key={collab.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-5 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#c9a96e] bg-[#2a1e0d] border border-[#78501d] text-[10px] font-medium px-2 py-1 rounded-md">
            <Star size={10} fill="currentColor" />
            Destacado
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
              <span className="text-[#555] text-xl font-bold">
                {collab.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[#f5f5f0] text-lg font-semibold">{collab.name}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[#555] text-xs mb-3">
                {ROLE_ICONS[collab.roleIcon]}
                <span>{ROLE_LABELS[collab.role]}</span>
                <span className="text-[#2a2a2a]">·</span>
                <MapPin size={11} />
                <span>{collab.location}</span>
              </div>
              <p className="text-[#666] text-sm leading-relaxed mb-4">{collab.description}</p>

              {/* Projects */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {collab.projects.map((p) => (
                  <Badge key={p} variant="default">{p}</Badge>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {collab.tags.map((tag) => (
                  <span key={tag} className="text-[#444] text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#2a2a2a]">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#1a1a1a]">
                {collab.instagram && (
                  <span className="flex items-center gap-1.5 text-[#555] text-xs">
                    <Instagram size={12} />
                    {collab.instagram}
                  </span>
                )}
                {collab.portfolio && (
                  <span className="flex items-center gap-1.5 text-[#555] text-xs">
                    <Globe size={12} />
                    {collab.portfolio}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Other collaborators */}
      <AnimatePresence>
        {collabs.filter((c) => !c.featured).length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {collabs
              .filter((c) => !c.featured)
              .map((collab, i) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 relative group hover:border-[#2a2a2a] transition-colors"
                >
                  <button
                    onClick={() => handleRemove(collab.id)}
                    className="absolute top-3 right-3 text-[#333] hover:text-[#f87171] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#555] text-sm font-bold">
                        {collab.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f0] text-sm font-semibold">{collab.name}</h3>
                      <div className="flex items-center gap-1 text-[#555] text-[10px]">
                        {ROLE_ICONS[collab.roleIcon]}
                        <span>{ROLE_LABELS[collab.role]}</span>
                      </div>
                    </div>
                  </div>
                  {collab.description && (
                    <p className="text-[#555] text-xs leading-relaxed line-clamp-2">{collab.description}</p>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>

      {/* Add modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Añadir Colaborador"
        description="Agrega un nuevo colaborador creativo."
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[#888] text-xs font-medium">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#444]"
            >
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Descripción"
            placeholder="Breve descripción..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Localización"
              placeholder="Ciudad, País"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <Input
              label="Instagram"
              placeholder="@handle"
              value={form.instagram}
              onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
            />
          </div>
          <Input
            label="Tags (separados por coma)"
            placeholder="editorial, lookbook, campaign"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAdd} disabled={!form.name}>
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
