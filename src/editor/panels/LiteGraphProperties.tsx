import { useState, useEffect } from 'react'
import { useEditorStore } from '@/shared/store/editorStore'
import { Film, Layers, Settings, Plus, Trash2, ChevronRight, ImageIcon, MessageSquare, User, GitBranch, Music, HelpCircle, Variable, Clock } from 'lucide-react'
import { SceneNodeLG } from '@/editor/litegraph/SceneNodeLG'
import { TransitionNodeLG } from '@/editor/litegraph/TransitionNodeLG'
import type { ComponentType } from '@/shared/types'
import { COMPONENT_LABELS, COMPONENT_DEFAULTS } from '@/shared/types'
import ComponentFields from './ComponentFields'

const CI: Record<ComponentType, React.ReactNode> = {
  background: <ImageIcon size={13} />, dialog: <MessageSquare size={13} />, character: <User size={13} />, choice: <GitBranch size={13} />,
  audio: <Music size={13} />, condition: <HelpCircle size={13} />, variable: <Variable size={13} />, wait: <Clock size={13} />,
  transition: <Layers size={13} />, endScene: <Film size={13} />,
}
const CL: ComponentType[] = ['background', 'dialog', 'character', 'choice', 'audio', 'condition', 'variable', 'wait', 'transition', 'endScene']

export default function LiteGraphProperties() {
  const node = useEditorStore((s) => s.liteGraphNode)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!node) return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-2xl bg-neutral-800 p-4"><Settings size={28} className="text-neutral-600" /></div>
      <p className="text-sm text-neutral-500">Click derecho para agregar nodos</p>
      <p className="text-xs text-neutral-600">Selecciona un nodo para ver propiedades</p>
    </div>
  )

  if (node instanceof SceneNodeLG) {
    const addComp = (type: ComponentType) => { node.addComponent(type, COMPONENT_DEFAULTS[type]()); setMenuOpen(false); setExpanded(null) }
    const removeComp = (id: string) => { node.removeComponent(id) }
    const updateProps = (id: string, props: Record<string, unknown>) => {
      const comp = node.sceneComponents.find((c) => c.id === id)
      if (comp) { Object.assign(comp.props, props); node.setDirtyCanvas(true, true) }
    }
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2"><Film size={14} className="text-indigo-400" /><span className="text-sm font-bold text-neutral-200">Escena</span></div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Nombre</label>
          <input type="text" value={node.sceneName} onChange={(e) => { node.sceneName = e.target.value; node.setDirtyCanvas(true, true) }} onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
        </div>
        <div className="border-t border-neutral-700 pt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Componentes ({node.sceneComponents.length})</p>
          <div className="space-y-1">
            {node.sceneComponents.map((c) => (
              <div key={c.id} className="rounded-lg border border-neutral-700 bg-neutral-800/50">
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700/30">
                  <ChevronRight size={12} className={`text-neutral-500 transition-transform ${expanded === c.id ? 'rotate-90' : ''}`} />
                  <span className="text-neutral-400">{CI[c.type]}</span>
                  <span className="flex-1 truncate">{COMPONENT_LABELS[c.type]}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeComp(c.id) }} className="rounded p-0.5 text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
                </button>
                {expanded === c.id && (
                  <div className="space-y-2 border-t border-neutral-700 px-3 py-3">
                    <ComponentFields comp={c} onUpdate={(props) => updateProps(c.id, props)} />
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
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-neutral-600 bg-[#2a2a2a] p-1.5 shadow-2xl">
                {CL.map((t) => (
                  <button key={t} onClick={() => addComp(t)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700">
                    <span className="text-neutral-400">{CI[t]}</span>{COMPONENT_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (node instanceof TransitionNodeLG) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2"><Layers size={14} className="text-purple-400" /><span className="text-sm font-bold text-neutral-200">Transicion</span></div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Tipo</label>
          <select value={node.transType} onChange={(e) => { node.transType = e.target.value; node.setDirtyCanvas(true, true) }} onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-purple-500">
            <option value="fade">Fade</option><option value="dissolve">Disolver</option><option value="slide">Deslizar</option><option value="cut">Corte</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Duracion (ms)</label>
          <input type="number" value={node.transDuration} onChange={(e) => { node.transDuration = Number(e.target.value); node.setDirtyCanvas(true, true) }} onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()} min={0}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-purple-500" />
        </div>
      </div>
    )
  }

  return null
}