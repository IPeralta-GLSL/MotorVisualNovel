import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react'
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react'
import type { SceneNode, SceneEdge, ProjectCharacter, ProjectVariable, ComponentType, SceneComponent } from '@/shared/types'
import { COMPONENT_DEFAULTS } from '@/shared/types'

interface EditorState {
  nodes: SceneNode[]
  edges: SceneEdge[]
  selectedNodeId: string | null
  characters: ProjectCharacter[]
  variables: ProjectVariable[]
  projectName: string

  setNodes: (nodes: SceneNode[]) => void
  setEdges: (edges: SceneEdge[]) => void
  onNodesChange: (changes: NodeChange<SceneNode>[]) => void
  onEdgesChange: (changes: EdgeChange<SceneEdge>[]) => void
  onConnect: (connection: Connection) => void
  addScene: (position: { x: number; y: number }) => void
  removeNode: (id: string) => void
  selectNode: (id: string | null) => void
  updateSceneData: (id: string, data: Partial<SceneNode['data']>) => void
  addComponent: (sceneId: string, type: ComponentType) => void
  removeComponent: (sceneId: string, componentId: string) => void
  updateComponentProps: (sceneId: string, componentId: string, props: Record<string, unknown>) => void
  moveComponent: (sceneId: string, componentId: string, direction: 'up' | 'down') => void
  addCharacter: (character: ProjectCharacter) => void
  removeCharacter: (id: string) => void
  addVariable: (variable: ProjectVariable) => void
  removeVariable: (name: string) => void
  setProjectName: (name: string) => void
}

const DEFAULT_SCENE: SceneNode['data'] = {
  label: 'Escena',
  description: '',
  components: [],
}

const SCENE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#a855f7', '#f97316']

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  characters: [],
  variables: [],
  projectName: 'Mi Novela Visual',

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as SceneNode[] })
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) })
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, animated: true, type: 'smoothstep', style: { stroke: '#818cf8', strokeWidth: 3 }, markerEnd: { type: 'arrowclosed', color: '#818cf8' } },
        get().edges,
      ),
    })
  },

  addScene: (position) => {
    const id = crypto.randomUUID()
    const colorIndex = get().nodes.length % SCENE_COLORS.length
    const nuevoNodo: SceneNode = {
      id,
      type: 'scene',
      position,
      data: { ...DEFAULT_SCENE, label: `Escena ${get().nodes.length + 1}` },
      style: { background: SCENE_COLORS[colorIndex], color: '#fff', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '0', width: 260 },
    }
    set({ nodes: [...get().nodes, nuevoNodo] })
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((a) => a.source !== id && a.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    })
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateSceneData: (id, data) => {
    set({
      nodes: get().nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
    })
  },

  addComponent: (sceneId, type) => {
    const nuevoComponente: SceneComponent = {
      id: crypto.randomUUID(),
      type,
      props: COMPONENT_DEFAULTS[type](),
    }
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== sceneId) return n
        return { ...n, data: { ...n.data, components: [...n.data.components, nuevoComponente] } }
      }),
    })
  },

  removeComponent: (sceneId, componentId) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== sceneId) return n
        return { ...n, data: { ...n.data, components: n.data.components.filter((c) => c.id !== componentId) } }
      }),
    })
  },

  updateComponentProps: (sceneId, componentId, props) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== sceneId) return n
        return {
          ...n,
          data: {
            ...n.data,
            components: n.data.components.map((c) => c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c),
          },
        }
      }),
    })
  },

  moveComponent: (sceneId, componentId, direction) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== sceneId) return n
        const comps = [...n.data.components]
        const idx = comps.findIndex((c) => c.id === componentId)
        if (idx < 0) return n
        const swap = direction === 'up' ? idx - 1 : idx + 1
        if (swap < 0 || swap >= comps.length) return n
        ;[comps[idx], comps[swap]] = [comps[swap], comps[idx]]
        return { ...n, data: { ...n.data, components: comps } }
      }),
    })
  },

  addCharacter: (character) => set({ characters: [...get().characters, character] }),
  removeCharacter: (id) => set({ characters: get().characters.filter((c) => c.id !== id) }),
  addVariable: (variable) => set({ variables: [...get().variables, variable] }),
  removeVariable: (name) => set({ variables: get().variables.filter((v) => v.name !== name) }),
  setProjectName: (name) => set({ projectName: name }),
}))