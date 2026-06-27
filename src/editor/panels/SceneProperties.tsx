import { useState } from 'react'
import { useEditorStore } from '@/shared/store/editorStore'
import type { ComponentType, SceneData } from '@/shared/types'
import { COMPONENT_LABELS } from '@/shared/types'
import ComponentFields from './ComponentFields'
import {
  X, Plus, Trash2, ChevronUp, ChevronDown, ChevronRight, Settings,
  Film, ImageIcon, MessageSquare, User, GitBranch, Music, HelpCircle,
  Variable, Clock, Layers, Flag,
} from 'lucide-react'

const COMP_ICONS: Record<ComponentType, React.ReactNode> = {
  background: <ImageIcon size={13} />, dialog: <MessageSquare size={13} />,
  character: <User size={13} />, choice: <GitBranch size={13} />,
  audio: <Music size={13} />, condition: <HelpCircle size={13} />,
  variable: <Variable size={13} />, wait: <Clock size={13} />,
  transition: <Layers size={13} />, endScene: <Flag size={13} />,
}

const COMP_LIST: ComponentType[] = ['background', 'dialog', 'character', 'choice', 'audio', 'condition', 'variable', 'wait', 'transition', 'endScene']

export default function SceneProperties() {
  const selectedId = useEditorStore((s) => s.selectedNodeId)
  const nodes = useEditorStore((s) => s.nodes)
  const updateSceneData = useEditorStore((s) => s.updateSceneData)
  const addComp = useEditorStore((s) => s.addComponent)
  const removeComp = useEditorStore((s) => s.removeComponent)
  const updateProps = useEditorStore((s) => s.updateComponentProps)
  const moveComp = useEditorStore((s) => s.moveComponent)
  const selectNode = useEditorStore((s) => s.selectNode)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const node = nodes.find((n) => n.id === selectedId)
  if (!node) return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-2xl bg-neutral-800 p-4"><Settings size={28} className="text-neutral-600" /></div>
      <p className="text-sm text-neutral-500">Selecciona una escena</p>
    </div>
  )

  const d = node.data as unknown as SceneData

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Film size={14} className="text-indigo-400" /><span className="text-sm font-bold text-neutral-200">Escena</span></div>
        <button onClick={() => selectNode(null)} className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-800"><X size={14} /></button>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-neutral-400">Nombre</label>
        <input type="text" value={d.label} onChange={(e) => updateSceneData(node.id, { label: e.target.value })}
          className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-neutral-400">Descripcion</label>
        <textarea value={d.description} onChange={(e) => updateSceneData(node.id, { description: e.target.value })} rows={2}
          className="w-full resize-none rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
      </div>

      <div className="border-t border-neutral-700 pt-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Componentes</p>
        <div className="space-y-1">
          {d.components.map((comp) => (
            <div key={comp.id} className="rounded-lg border border-neutral-700 bg-neutral-800/50">
              <button onClick={() => setExpanded(expanded === comp.id ? null : comp.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700/30">
                <ChevronRight size={12} className={`text-neutral-500 transition-transform ${expanded === comp.id ? 'rotate-90' : ''}`} />
                <span className="text-neutral-400">{COMP_ICONS[comp.type]}</span>
                <span className="flex-1 truncate">{COMPONENT_LABELS[comp.type]}</span>
                <button onClick={(e) => { e.stopPropagation(); moveComp(node.id, comp.id, 'up') }} className="rounded p-0.5 text-neutral-600 hover:text-neutral-300"><ChevronUp size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveComp(node.id, comp.id, 'down') }} className="rounded p-0.5 text-neutral-600 hover:text-neutral-300"><ChevronDown size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); removeComp(node.id, comp.id) }} className="rounded p-0.5 text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
              </button>
              {expanded === comp.id && (
                <div className="space-y-2 border-t border-neutral-700 px-3 py-3">
                  <ComponentFields comp={comp} onUpdate={(props) => updateProps(node.id, comp.id, props)} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative mt-2">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-600 py-2 text-xs text-neutral-500 hover:border-indigo-500 hover:text-indigo-400">
            <Plus size={12} /> Agregar Componente
          </button>
          {menuOpen && (
            <div className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-60 overflow-y-auto rounded-xl border border-neutral-600 bg-[#2a2a2a] p-1.5 shadow-2xl">
              {COMP_LIST.map((t) => (
                <button key={t} onClick={() => { addComp(node.id, t); setMenuOpen(false); setExpanded(null) }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700">
                  <span className="text-neutral-400">{COMP_ICONS[t]}</span>
                  {COMPONENT_LABELS[t]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}