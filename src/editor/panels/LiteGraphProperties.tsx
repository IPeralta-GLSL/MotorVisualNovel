import { useEditorStore } from '@/shared/store/editorStore'
import { Film, Layers, Settings } from 'lucide-react'
import { SceneNodeLG } from '@/editor/litegraph/SceneNodeLG'
import { TransitionNodeLG } from '@/editor/litegraph/TransitionNodeLG'

export default function LiteGraphProperties() {
  const node = useEditorStore((s) => s.liteGraphNode)

  if (!node) return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-2xl bg-neutral-800 p-4"><Settings size={28} className="text-neutral-600" /></div>
      <p className="text-sm text-neutral-500">Selecciona un nodo en el grafo</p>
    </div>
  )

  if (node instanceof SceneNodeLG) {
    const n = node
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2"><Film size={14} className="text-indigo-400" /><span className="text-sm font-bold text-neutral-200">Escena</span></div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Nombre</label>
          <input type="text" value={n.sceneName} onChange={(e) => { n.sceneName = e.target.value; n.setDirtyCanvas(true, true) }}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
        </div>
        <div className="border-t border-neutral-700 pt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Componentes ({n.sceneComponents.length})</p>
          {n.sceneComponents.length === 0 && <p className="text-xs text-neutral-600">Sin componentes. Agrega desde el grafo.</p>}
          {n.sceneComponents.map((c) => (
            <div key={c.id} className="mb-1 rounded-lg bg-neutral-800 px-3 py-2 text-xs text-neutral-300">
              {c.type} <span className="text-neutral-500">#{c.id.slice(0, 6)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (node instanceof TransitionNodeLG) {
    const n = node
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2"><Layers size={14} className="text-purple-400" /><span className="text-sm font-bold text-neutral-200">Transicion</span></div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Tipo</label>
          <select value={n.transType} onChange={(e) => { n.transType = e.target.value; n.setDirtyCanvas(true, true) }}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-purple-500">
            <option value="fade">Fade</option>
            <option value="dissolve">Disolver</option>
            <option value="slide">Deslizar</option>
            <option value="cut">Corte</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-neutral-400">Duracion (ms)</label>
          <input type="number" value={n.transDuration} onChange={(e) => { n.transDuration = Number(e.target.value); n.setDirtyCanvas(true, true) }} min={0}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-purple-500" />
        </div>
      </div>
    )
  }

  return null
}