import { useCallback, useState, useRef, useEffect } from 'react'
import { useEditorStore } from '@/shared/store/editorStore'
import { useReactFlow } from '@xyflow/react'
import { Plus, ZoomIn, ZoomOut, Maximize, Trash2, PlayCircle, Download, Upload } from 'lucide-react'

interface Props { onPlay: () => void }

export default function Toolbar({ onPlay }: Props) {
  const { addScene, projectName, nodes, edges, setNodes, setEdges, selectedNodeId, removeNode } = useEditorStore()
  const rf = useReactFlow()

  const handleAddScene = useCallback(() => {
    const vp = rf.getViewport()
    addScene({ x: (500 - vp.x) / vp.zoom, y: (300 - vp.y) / vp.zoom })
  }, [addScene, rf])

  const handleExport = useCallback(() => {
    const data = { name: projectName, version: '1.0.0', nodes, edges, date: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [projectName, nodes, edges])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.nodes) setNodes(data.nodes)
          if (data.edges) setEdges(data.edges)
        } catch { /* ignore */ }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [setNodes, setEdges])

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-700 bg-[#252525] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <span className="text-sm font-bold">VN</span>
        </div>
        <span className="text-sm font-semibold text-neutral-200">{projectName}</span>
        <div className="mx-2 h-6 w-px bg-neutral-600" />
        <button onClick={handleAddScene} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500">
          <Plus size={14} /> Agregar Escena
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => rf.zoomIn()} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" title="Acercar"><ZoomIn size={16} /></button>
        <button onClick={() => rf.zoomOut()} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" title="Alejar"><ZoomOut size={16} /></button>
        <button onClick={() => rf.fitView({ padding: 0.2 })} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" title="Ajustar"><Maximize size={16} /></button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={() => selectedNodeId && removeNode(selectedNodeId)} className="rounded-lg p-2 text-neutral-400 hover:bg-red-900/50 hover:text-red-400" title="Eliminar"><Trash2 size={16} /></button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={onPlay} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500"><PlayCircle size={14} /> Jugar</button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={handleExport} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" title="Exportar"><Download size={16} /></button>
        <button onClick={handleImport} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" title="Importar"><Upload size={16} /></button>
      </div>
    </div>
  )
}