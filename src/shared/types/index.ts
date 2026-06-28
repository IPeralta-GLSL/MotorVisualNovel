import type { Node, Edge } from '@xyflow/react'

export type ComponentType =
  | 'background'
  | 'dialog'
  | 'character'
  | 'choice'
  | 'audio'
  | 'condition'
  | 'variable'
  | 'wait'
  | 'transition'
  | 'endScene'

export interface SceneComponent {
  id: string
  type: ComponentType
  props: Record<string, unknown>
}

export interface SceneData {
  label: string
  description: string
  components: SceneComponent[]
  [key: string]: unknown
}

export type SceneNode = Node<SceneData, 'scene'>
export type SceneEdge = Edge

export interface TransitionData {
  transType: string
  transDuration: number
}

export type LiteGraphNode = { type: string; sceneName?: string; sceneComponents?: SceneComponent[]; transType?: string; transDuration?: number; id: number; [key: string]: unknown } | null

export interface ProjectCharacter {
  id: string
  name: string
  color: string
  expressions: string[]
}

export interface ProjectVariable {
  name: string
  type: 'number' | 'text' | 'boolean'
  defaultValue: string
}

export const COMPONENT_DEFAULTS: Record<ComponentType, () => Record<string, unknown>> = {
  background: () => ({ file: '', transition: 'fade', duration: 1000 }),
  dialog: () => ({ character: '', text: 'Escribí el diálogo aquí...', expression: 'neutral', position: 'center' }),
  character: () => ({ character: '', action: 'show', expression: 'neutral', position: 'center' }),
  choice: () => ({ options: [{ id: crypto.randomUUID(), text: 'Opción 1' }, { id: crypto.randomUUID(), text: 'Opción 2' }] }),
  audio: () => ({ file: '', audioType: 'music', volume: 0.5, loop: false }),
  condition: () => ({ variable: '', operator: '==', value: '' }),
  variable: () => ({ name: '', operation: 'assign', value: '' }),
  wait: () => ({ duration: 1000 }),
  transition: () => ({ type: 'fade', duration: 500 }),
  endScene: () => ({ type: 'endScene' }),
}

export const COMPONENT_LABELS: Record<ComponentType, string> = {
  background: 'Fondo',
  dialog: 'Diálogo',
  character: 'Personaje',
  choice: 'Elección',
  audio: 'Audio',
  condition: 'Condición',
  variable: 'Variable',
  wait: 'Espera',
  transition: 'Transición',
  endScene: 'Fin',
}