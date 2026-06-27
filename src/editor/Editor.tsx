import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useState } from 'react'
import { useEditorStore } from '@/shared/store/editorStore'
import { nodeTypes } from '@/editor/nodes'
import Toolbar from '@/editor/toolbar/Toolbar'
import Sidebar from '@/editor/panels/Sidebar'
import GamePreview from '@/editor/preview/GamePreview'
import type { SceneNode } from '@/shared/types'

export default function Editor() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } = useEditorStore()

  const onNodeClick = useCallback((_: React.MouseEvent, node: SceneNode) => { selectNode(node.id) }, [selectNode])
  const onPaneClick = useCallback(() => { selectNode(null) }, [selectNode])

  return (
    <div className="flex h-screen w-screen flex-col bg-[#1e1e1e]">
      <Toolbar onPlay={() => setPreviewOpen(true)} />
      {previewOpen && <GamePreview onClose={() => setPreviewOpen(false)} />}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            onNodeClick={onNodeClick} onPaneClick={onPaneClick}
            fitView snapToGrid snapGrid={[16, 16]} className="bg-[#1e1e1e]"
            defaultEdgeOptions={{ animated: true, type: 'smoothstep', style: { stroke: '#818cf8', strokeWidth: 3 }, markerEnd: { type: 'arrowclosed', color: '#818cf8', width: 20, height: 20 } }}>
            <Background gap={20} size={1} color="#333333" />
            <Controls showInteractive={false} className="!rounded-lg !border !border-neutral-700 !bg-neutral-800" />
            <MiniMap nodeStrokeColor="#555555" nodeColor="#2a2a2a" nodeBorderRadius={8} className="!rounded-lg !border !border-neutral-700" style={{ background: '#252525' }} maskColor="rgba(30,30,30,0.7)" />
          </ReactFlow>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}