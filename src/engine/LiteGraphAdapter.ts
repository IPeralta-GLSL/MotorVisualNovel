import type { LGraph, LGraphNode as LGNode } from 'litegraph.js'
import { SceneNodeLG } from '@/editor/litegraph/SceneNodeLG'
import { TransitionNodeLG } from '@/editor/litegraph/TransitionNodeLG'
import type { SceneComponent } from '@/shared/types'

export interface AdapterScene {
  id: string
  name: string
  components: SceneComponent[]
  next: { sceneId: string; handleId?: string }[]
}

export function extractScenes(graph: LGraph): AdapterScene[] {
  const g = graph as unknown as { _nodes: LGNode[]; _links: Map<number, { origin_id: number; origin_slot: number; target_id: number; target_slot: number }> }
  const scenes: AdapterScene[] = []
  const nodeMap = new Map<number, LGNode>()
  for (const n of g._nodes) nodeMap.set(n.id, n)

  for (const node of g._nodes) {
    if (node instanceof SceneNodeLG) {
      const next: { sceneId: string; handleId?: string }[] = []
      if (node.outputs) {
        for (let i = 0; i < node.outputs.length; i++) {
          const out = node.outputs[i]
          if (out.links) {
            for (const linkId of out.links) {
              const link = g._links.get(linkId)
              if (link) {
                const targetNode = nodeMap.get(link.target_id)
                if (targetNode) {
                  let handleId: string | undefined
                  if (out.name && out.name !== 'Salida') handleId = out.name
                  next.push({ sceneId: String(targetNode.id), handleId })
                }
              }
            }
          }
        }
      }
      scenes.push({
        id: String(node.id),
        name: node.sceneName,
        components: node.sceneComponents,
        next,
      })
    }
  }
  return scenes
}

export function findFirstScene(graph: LGraph): AdapterScene | null {
  const scenes = extractScenes(graph)
  if (scenes.length === 0) return null
  return scenes[0]
}