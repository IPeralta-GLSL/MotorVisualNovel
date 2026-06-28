import { LGraphNode } from 'litegraph.js'
import type { SceneComponent, ComponentType } from '@/shared/types'
import { COMPONENT_LABELS } from '@/shared/types'

const CC: Record<ComponentType, string> = {
  background: '#06b6d4', dialog: '#6366f1', character: '#ec4899', choice: '#f59e0b',
  audio: '#8b5cf6', condition: '#f97316', variable: '#14b8a6', wait: '#64748b',
  transition: '#a855f7', endScene: '#ef4444',
}

export class SceneNodeLG extends LGraphNode {
  static title = 'Escena'
  static title_color = '#6366f1'
  static title_text_color = '#ffffff'

  sceneName: string = 'Escena'
  sceneComponents: SceneComponent[] = []

  constructor(title?: string) {
    super(title || 'Escena')
    this.addInput('Entrada', 'scene')
    this.addOutput('Salida', 'scene')
    this.size = [240, 80]
    this.sceneName = title || 'Escena'
    this.properties = { name: this.sceneName }
    this.color = '#2d2d2d'
    this.bgcolor = '#1e1e1e'
    this.boxcolor = '#6366f1'
  }

  onExecute() {}

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const w = this.size[0]
    let y = 32

    ctx.font = 'bold 13px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#e0e0e0'
    ctx.textAlign = 'center'
    ctx.fillText(this.sceneName, w / 2, y)
    y += 20

    ctx.font = '10px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText(`${this.sceneComponents.length} componentes`, w / 2, y)
    y += 16

    for (const comp of this.sceneComponents.slice(0, 6)) {
      ctx.fillStyle = CC[comp.type] || '#666'
      ctx.beginPath()
      ctx.roundRect(12, y, w - 24, 16, 4)
      ctx.fill()

      ctx.font = '10px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.fillText(COMPONENT_LABELS[comp.type] || comp.type, 20, y + 12)
      y += 20
    }

    if (this.sceneComponents.length > 6) {
      ctx.fillStyle = '#555'
      ctx.textAlign = 'center'
      ctx.fillText(`+${this.sceneComponents.length - 6} mas`, w / 2, y + 8)
      y += 18
    }

    this.size[1] = Math.max(80, y + 10)
  }

  addComponent(type: ComponentType, props: Record<string, unknown>) {
    this.sceneComponents.push({ id: crypto.randomUUID(), type, props })
    this.setDirtyCanvas(true, true)
  }

  removeComponent(id: string) {
    this.sceneComponents = this.sceneComponents.filter((c) => c.id !== id)
    this.setDirtyCanvas(true, true)
  }

  serializeExtra(o: Record<string, unknown>) {
    o.sceneName = this.sceneName
    o.sceneComponents = this.sceneComponents
  }

  configureExtra(o: Record<string, unknown>) {
    if (o.sceneName) this.sceneName = o.sceneName as string
    if (o.sceneComponents) this.sceneComponents = o.sceneComponents as SceneComponent[]
  }
}