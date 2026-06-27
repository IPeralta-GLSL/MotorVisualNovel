import type { SceneNode, SceneEdge, SceneComponent } from '@/shared/types'

export interface EngineState {
  currentNodeId: string | null
  currentComponentIndex: number
  variables: Record<string, string>
  visibleCharacters: { id: string; expression: string; position: string }[]
  background: string
  dialogText: { character: string; text: string } | null
  choiceOptions: { id: string; text: string }[] | null
  waitingForInput: boolean
  running: boolean
}

export type EngineListener = (state: EngineState) => void

export class SceneEngine {
  private nodes: SceneNode[]
  private edges: SceneEdge[]
  private vars: Record<string, string> = {}
  private state: EngineState
  private listeners: EngineListener[] = []
  private waitTimer: ReturnType<typeof setTimeout> | null = null

  constructor(nodes: SceneNode[], edges: SceneEdge[]) {
    this.nodes = nodes
    this.edges = edges
    this.state = { currentNodeId: null, currentComponentIndex: 0, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: false }
  }

  subscribe(listener: EngineListener) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter((l) => l !== listener) }
  }

  private notify() { this.listeners.forEach((l) => l({ ...this.state })) }

  private nextScene(sceneId: string): SceneNode | null {
    const edge = this.edges.find((e) => e.source === sceneId)
    return edge ? (this.nodes.find((n) => n.id === edge.target) || null) : null
  }

  start() {
    const first = this.nodes[0]
    if (!first) return
    this.state = { currentNodeId: first.id, currentComponentIndex: 0, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: true }
    this.notify()
    this.executeComponent()
  }

  stop() {
    if (this.waitTimer) clearTimeout(this.waitTimer)
    this.state = { currentNodeId: null, currentComponentIndex: 0, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: false }
    this.notify()
  }

  advance() {
    if (!this.state.waitingForInput) return
    if (this.state.dialogText) {
      this.state.dialogText = null
      this.state.waitingForInput = false
      this.state.currentComponentIndex++
      this.notify()
      this.executeComponent()
    }
  }

  selectChoice(optionId: string) {
    if (!this.state.choiceOptions || !this.state.currentNodeId) return
    const edge = this.edges.find((e) => e.source === this.state.currentNodeId && e.sourceHandle === `choice-${optionId}`)
    if (!edge) return
    const next = this.nodes.find((n) => n.id === edge.target)
    if (!next) return
    this.state.choiceOptions = null
    this.state.waitingForInput = false
    this.state.currentNodeId = next.id
    this.state.currentComponentIndex = 0
    this.notify()
    this.executeComponent()
  }

  private executeComponent() {
    const node = this.nodes.find((n) => n.id === this.state.currentNodeId)
    if (!node) { this.state.running = false; this.notify(); return }
    const components = (node.data as unknown as { components: SceneComponent[] }).components
    if (this.state.currentComponentIndex >= components.length) {
      const next = this.nextScene(node.id)
      if (next) { this.state.currentNodeId = next.id; this.state.currentComponentIndex = 0; this.notify(); this.executeComponent() }
      else { this.state.running = false; this.notify() }
      return
    }
    const comp = components[this.state.currentComponentIndex]
    const p = comp.props
    switch (comp.type) {
      case 'background': this.state.background = (p.file as string) || ''; this.notify(); this.nextComp(); break
      case 'dialog': this.state.dialogText = { character: (p.character as string) || '???', text: (p.text as string) || '' }; this.state.waitingForInput = true; this.notify(); break
      case 'character': {
        const ch = p.character as string, act = p.action as string
        if (act === 'show') this.state.visibleCharacters = [...this.state.visibleCharacters.filter((x) => x.id !== ch), { id: ch, expression: (p.expression as string) || 'neutral', position: (p.position as string) || 'center' }]
        else if (act === 'hide') this.state.visibleCharacters = this.state.visibleCharacters.filter((x) => x.id !== ch)
        this.notify(); this.nextComp(); break
      }
      case 'choice': { this.state.choiceOptions = (p.options as { id: string; text: string }[]) || []; this.state.waitingForInput = true; this.notify(); break }
      case 'audio': this.notify(); this.nextComp(); break
      case 'condition': this.nextComp(); break
      case 'variable': {
        const n = p.name as string
        if (n) {
          const act = Number(this.vars[n]) || 0, nv = Number(p.value as string) || 0
          if (p.operation === 'assign') this.vars[n] = p.value as string
          else if (p.operation === 'add') this.vars[n] = String(act + nv)
          else if (p.operation === 'subtract') this.vars[n] = String(act - nv)
          this.state.variables = { ...this.vars }
        }
        this.notify(); this.nextComp(); break
      }
      case 'wait': this.waitTimer = setTimeout(() => this.nextComp(), (p.duration as number) || 1000); break
      case 'transition': this.notify(); this.nextComp(); break
      case 'endScene': this.state.running = false; this.notify(); break
      default: this.nextComp(); break
    }
  }

  private nextComp() { this.state.currentComponentIndex++; this.notify(); this.executeComponent() }
  getState(): EngineState { return { ...this.state } }
}