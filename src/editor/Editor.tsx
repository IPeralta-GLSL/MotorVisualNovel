import { useEffect, useRef, useState } from 'react'
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js'
import 'litegraph.js/css/litegraph.css'
import { SceneNodeLG } from '@/editor/litegraph/SceneNodeLG'
import { TransitionNodeLG } from '@/editor/litegraph/TransitionNodeLG'
import Sidebar from '@/editor/panels/Sidebar'
import GamePreview from '@/editor/preview/GamePreview'
import { Plus, Layers, PlayCircle, Trash2 } from 'lucide-react'
import { useEditorStore } from '@/shared/store/editorStore'
export default function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<LGraph | null>(null)
  const [preview, setPreview] = useState(false)
  const { projectName, setLiteGraphNode, setLiteGraph } = useEditorStore()

  useEffect(() => {
    if (!canvasRef.current) return

    LiteGraph.registerNodeType('Escena', SceneNodeLG as unknown as new () => import('litegraph.js').LGraphNode)
    LiteGraph.registerNodeType('Transicion', TransitionNodeLG as unknown as new () => import('litegraph.js').LGraphNode)

    const graph = new LGraph()
    const canvas = new LGraphCanvas(canvasRef.current, graph)

    canvas.allow_searchbox = false
    canvas.allow_dragnodes = true
    canvas.clear_background = true
    canvas.default_link_color = '#818cf8'
    canvas.highquality_render = true
    canvas.render_shadows = false
    canvas.connections_width = 3
    canvas.render_curved_connections = true
    canvas.show_info = false
    canvas.zoom_modify_alpha = false

    canvas.getCanvasMenuOptions = () => {
      return [
        { content: 'Agregar Escena', callback: () => addNodeToGraph('scene') },
        { content: 'Agregar Transicion', callback: () => addNodeToGraph('transition') },
      ]
    }

    canvas.getNodeMenuOptions = (node: import('litegraph.js').LGraphNode) => {
      return [
        { content: 'Borrar', callback: () => { graph.remove(node) } },
      ]
    }

    canvas.onNodeSelected = (node: import('litegraph.js').LGraphNode) => {
      setLiteGraphNode(node)
    }

    canvas.onNodeDeselected = (node: import('litegraph.js').LGraphNode) => {
      setLiteGraphNode(null)
    }

    graph.onNodeAdded = (node: import('litegraph.js').LGraphNode) => {
      node.color = '#2d2d2d'
      node.bgcolor = '#1e1e1e'
    }

    const resize = () => {
      const parent = canvasRef.current?.parentElement
      if (!parent || !canvasRef.current) return
      const dpr = window.devicePixelRatio || 1
      canvasRef.current.width = parent.clientWidth * dpr
      canvasRef.current.height = parent.clientHeight * dpr
      canvasRef.current.style.width = `${parent.clientWidth}px`
      canvasRef.current.style.height = `${parent.clientHeight}px`
      canvas.resize()
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvasRef.current.parentElement) ro.observe(canvasRef.current.parentElement)

    graph.start()
    graphRef.current = graph
    setLiteGraph(graph)
    return () => { ro.disconnect(); graph.stop(); setLiteGraph(null) }
  }, [setLiteGraphNode, setLiteGraph])

  const addNodeToGraph = (type: 'scene' | 'transition') => {
    if (!graphRef.current) return
    const g = graphRef.current as unknown as { _nodes: { length: number }[] }
    let n: SceneNodeLG | TransitionNodeLG
    if (type === 'scene') {
      n = new SceneNodeLG(`Escena ${g._nodes.length + 1}`)
      n.pos = [200 + g._nodes.length * 60, 200]
    } else {
      n = new TransitionNodeLG()
      n.pos = [200 + g._nodes.length * 60, 350]
    }
    graphRef.current.add(n as unknown as import('litegraph.js').LGraphNode)
  }

  const deleteSelected = () => {
    if (!graphRef.current) return
    const g = graphRef.current as unknown as { selected_nodes: Record<string, import('litegraph.js').LGraphNode> }
    for (const id in g.selected_nodes) graphRef.current.remove(g.selected_nodes[id])
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#1a1a1a]">
      <div className="relative z-10 flex h-12 items-center justify-between border-b border-neutral-700 bg-[#252525] px-4" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"><span className="text-sm font-bold">VN</span></div>
          <span className="text-sm font-semibold text-neutral-200">{projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={deleteSelected} className="rounded-lg p-2 text-neutral-400 hover:bg-red-900/50 hover:text-red-400" title="Eliminar seleccionado" style={{ pointerEvents: 'auto' }}><Trash2 size={16} /></button>
          <div className="mx-1 h-6 w-px bg-neutral-600" />
          <button onClick={() => setPreview(true)} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500" style={{ pointerEvents: 'auto' }}><PlayCircle size={14} /> Jugar</button>
        </div>
      </div>
      {preview && <GamePreview onClose={() => setPreview(false)} />}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1" style={{ zIndex: 0 }}>
          <canvas ref={canvasRef} className="absolute inset-0" style={{ background: '#1a1a1a' }} />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}