import { LGraphNode } from 'litegraph.js'

export class TransitionNodeLG extends LGraphNode {
  static title = 'Transicion'
  static title_color = '#a855f7'
  static title_text_color = '#ffffff'

  transType: string = 'fade'
  transDuration: number = 500

  constructor(title?: string) {
    super(title || 'Transicion')
    this.addInput('Entrada', 'scene')
    this.addOutput('Salida', 'scene')
    this.size = [200, 60]
    this.properties = { tipo: 'fade', duracion: 500 }
    this.color = '#2d2d2d'
    this.bgcolor = '#1e1e1e'
    this.boxcolor = '#a855f7'
  }

  onExecute() {}

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const w = this.size[0]
    let y = 32

    ctx.font = 'bold 12px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#e0e0e0'
    ctx.textAlign = 'center'
    ctx.fillText('Transicion', w / 2, y)
    y += 18

    ctx.font = '10px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#a78bfa'
    ctx.fillText(`${this.transType} - ${this.transDuration}ms`, w / 2, y)
    y += 18

    this.size[1] = Math.max(60, y + 10)
  }

  serializeExtra(o: Record<string, unknown>) {
    o.transType = this.transType
    o.transDuration = this.transDuration
  }

  configureExtra(o: Record<string, unknown>) {
    if (o.transType) this.transType = o.transType as string
    if (o.transDuration) this.transDuration = o.transDuration as number
  }
}