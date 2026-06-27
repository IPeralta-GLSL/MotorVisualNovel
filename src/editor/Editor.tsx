import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEditorStore } from '@/compartido/store/editorStore'
import { tiposNodos } from '@/editor/nodos'
import BarraHerramientas from '@/editor/barra-herramientas/BarraHerramientas'
import PanelLateral from '@/editor/paneles/PanelLateral'
import { useCallback, useState } from 'react'
import type { NodoVisualNovel } from '@/compartido/tipos'
import VistaPrevia from '@/editor/VistaPrevia'

export default function Editor() {
  const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false)
  const {
    nodos,
    aristas,
    onNodesChange,
    onEdgesChange,
    onConnect,
    seleccionarNodo,
  } = useEditorStore()

  const onInit = useCallback(() => {
    console.log('Editor inicializado')
  }, [])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: NodoVisualNovel) => {
      seleccionarNodo(node.id)
    },
    [seleccionarNodo],
  )

  const onPaneClick = useCallback(() => {
    seleccionarNodo(null)
  }, [seleccionarNodo])

  return (
    <div className="flex h-screen w-screen flex-col bg-[#1e1e1e]">
      <BarraHerramientas onJugar={() => setVistaPreviaAbierta(true)} />
      {vistaPreviaAbierta && <VistaPrevia onCerrar={() => setVistaPreviaAbierta(false)} />}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <ReactFlow
            nodes={nodos}
            edges={aristas}
            nodeTypes={tiposNodos}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            className="bg-[#1e1e1e]"
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
            }}
          >
            <Background
              gap={20}
              size={1}
              color="#333333"
            />
            <Controls
              showInteractive={false}
              className="!rounded-lg !border !border-slate-700 !bg-slate-800"
            />
            <MiniMap
              nodeStrokeColor="#555555"
              nodeColor="#2a2a2a"
              nodeBorderRadius={8}
              className="!rounded-lg !border !border-neutral-700"
              style={{ background: '#252525' }}
              maskColor="rgba(30, 30, 30, 0.7)"
            />
          </ReactFlow>
        </div>
        <PanelLateral />
      </div>
    </div>
  )
}