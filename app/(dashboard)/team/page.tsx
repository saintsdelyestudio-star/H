'use client'

import { motion } from 'framer-motion'
import { Instagram, Mail, CheckCircle2, Zap, Target } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'

const TEAM = [
  {
    id: 'aimar',
    name: 'Aimar Rodríguez',
    initials: 'AR',
    role: 'Co-Founder & Creative Director',
    equity: 50,
    email: 'aimar@delye.co',
    instagram: '@aimarrdz',
    bio: 'Visión creativa, dirección de producto y estrategia de marca. Responsable del ADN estético de Delyé.',
    responsibilities: [
      'Dirección creativa y diseño de colecciones',
      'Fotografía y dirección de campañas',
      'Identidad de marca y comunicación visual',
      'Desarrollo de producto',
    ],
    stats: {
      dropsManaged: 4,
      tasksCompleted: 127,
      collections: 3,
    },
    color: '#1a1a2e',
    accent: '#c9a96e',
  },
  {
    id: 'daniel',
    name: 'Daniel Rodríguez',
    initials: 'DR',
    role: 'Co-Founder & Operations Director',
    equity: 50,
    email: 'daniel@delye.co',
    instagram: '@danielrdz',
    bio: 'Operaciones, tecnología y crecimiento. Responsable de la estructura de negocio y la escala de Delyé.',
    responsibilities: [
      'Operaciones y logística',
      'Tecnología y plataforma digital',
      'Finanzas y proyección de negocio',
      'Estrategia de crecimiento y distribución',
    ],
    stats: {
      dropsManaged: 4,
      tasksCompleted: 114,
      collections: 3,
    },
    color: '#1a2e1a',
    accent: '#4ade80',
  },
]

export default function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Los fundadores detrás de Delyé."
      />

      {/* Equity overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-6"
      >
        <p className="text-[#555] text-xs font-medium tracking-widest uppercase mb-4">Distribución de equity</p>
        <div className="flex rounded-full overflow-hidden h-2 mb-4">
          <div className="w-1/2 bg-[#c9a96e]" />
          <div className="w-1/2 bg-[#f5f5f0]" />
        </div>
        <div className="flex justify-between">
          {TEAM.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: m.id === 'aimar' ? '#c9a96e' : '#f5f5f0' }}
              />
              <span className="text-[#888] text-xs">{m.name}</span>
              <span className="text-[#f5f5f0] text-xs font-semibold">{m.equity}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-[#2a2a2a] transition-colors"
          >
            {/* Avatar + name */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: member.color, color: member.accent }}
              >
                {member.initials}
              </div>
              <div className="flex-1">
                <h2 className="text-[#f5f5f0] font-semibold text-base">{member.name}</h2>
                <p className="text-[#555] text-xs mt-0.5">{member.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: member.color, color: member.accent }}
                  >
                    {member.equity}% equity
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#666] text-sm leading-relaxed mb-5">{member.bio}</p>

            {/* Responsibilities */}
            <div className="mb-5">
              <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2.5">Responsabilidades</p>
              <div className="space-y-1.5">
                {member.responsibilities.map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-[#333] mt-0.5 flex-shrink-0" />
                    <span className="text-[#888] text-xs">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={11} className="text-[#555]" />
                </div>
                <p className="text-[#f5f5f0] font-bold text-base">{member.stats.dropsManaged}</p>
                <p className="text-[#444] text-[10px] mt-0.5">Drops</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target size={11} className="text-[#555]" />
                </div>
                <p className="text-[#f5f5f0] font-bold text-base">{member.stats.tasksCompleted}</p>
                <p className="text-[#444] text-[10px] mt-0.5">Tasks</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={11} className="text-[#555]" />
                </div>
                <p className="text-[#f5f5f0] font-bold text-base">{member.stats.collections}</p>
                <p className="text-[#444] text-[10px] mt-0.5">Colecciones</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#1a1a1a]">
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-1.5 text-[#555] hover:text-[#f5f5f0] text-xs transition-colors"
              >
                <Mail size={12} />
                {member.email}
              </a>
              <span className="text-[#2a2a2a]">·</span>
              <span className="flex items-center gap-1.5 text-[#555] text-xs">
                <Instagram size={12} />
                {member.instagram}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
