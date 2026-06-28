import type { LGraph } from 'litegraph.js'
import { extractScenes, type AdapterScene } from './LiteGraphAdapter'
import { TransitionNodeLG } from '@/editor/litegraph/TransitionNodeLG'

export interface VNState {
  currentSceneId: string | null
  variables: Record<string, string>
  visibleCharacters: { id: string; expression: string; position: string }[]
  background: string
  dialogText: { character: string; text: string } | null
  choiceOptions: { id: string; text: string }[] | null
  waitingForInput: boolean
  running: boolean
}

export type VNListener = (state: VNState) => void

export class VNEngine {
  private graph: LGraph
  private scenes: AdapterScene[] = []
  private vars: Record<string, string> = {}
  private state: VNState
  private listeners: VNListener[] = []
  private waitTimer: ReturnType<typeof setTimeout> | null = null
  private compIndex = 0

  constructor(graph: LGraph) {
    this.graph = graph
    this.state = { currentSceneId: null, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: false }
  }

  subscribe(listener: VNListener) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter((l) => l !== listener) }
  }

  private notify() { this.listeners.forEach((l) => l({ ...this.state })) }

  start() {
    this.scenes = extractScenes(this.graph)
    const first = this.scenes[0]
    if (!first) return
    this.state = { currentSceneId: first.id, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: true }
    this.compIndex = 0
    this.notify()
    this.runComp()
  }

  stop() {
    if (this.waitTimer) clearTimeout(this.waitTimer)
    this.state = { currentSceneId: null, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: false }
    this.notify()
  }

  advance() {
    if (!this.state.waitingForInput || !this.state.dialogText) return
    this.state.dialogText = null
    this.state.waitingForInput = false
    this.compIndex++
    this.notify()
    this.runComp()
  }

  selectChoice(optionId: string) {
    if (!this.state.choiceOptions || !this.state.currentSceneId) return
    const scene = this.scenes.find((s) => s.id === this.state.currentSceneId)
    if (!scene) return
    const handleId = `choice-${optionId}`
    const next = scene.next.find((n) => n.handleId === handleId)
    if (!next) return
    this.goToScene(next.sceneId)
  }

  private goToScene(id: string) {
    const scene = this.scenes.find((s) => s.id === id)
    if (!scene) { this.state.running = false; this.notify(); return }
    this.state.currentSceneId = id
    this.state.choiceOptions = null
    this.state.waitingForInput = false
    this.compIndex = 0
    this.notify()
    this.runComp()
  }

  private runComp() {
    const scene = this.scenes.find((s) => s.id === this.state.currentSceneId)
    if (!scene) { this.state.running = false; this.notify(); return }

    if (this.compIndex >= scene.components.length) {
      const nextScene = scene.next.find((n) => !n.handleId) || scene.next[0]
      if (nextScene) { this.goToScene(nextScene.sceneId) }
      else { this.state.running = false; this.notify() }
      return
    }

    const comp = scene.components[this.compIndex]
    const p = comp.props
    switch (comp.type) {
      case 'background': this.state.background = (p.file as string) || ''; this.notify(); this.nextComp(); break
      case 'dialog':
        this.state.dialogText = { character: (p.character as string) || '???', text: (p.text as string) || '' }
        this.state.waitingForInput = true; this.notify(); break
      case 'character': {
        const ch = p.character as string, act = p.action as string
        if (act === 'show') this.state.visibleCharacters = [...this.state.visibleCharacters.filter((x) => x.id !== ch), { id: ch, expression: (p.expression as string) || 'neutral', position: (p.position as string) || 'center' }]
        else if (act === 'hide') this.state.visibleCharacters = this.state.visibleCharacters.filter((x) => x.id !== ch)
        this.notify(); this.nextComp(); break
      }
      case 'choice': {
        const opts = (p.options as { id: string; text: string }[]) || []
        this.state.choiceOptions = opts
        this.state.waitingForInput = true; this.notify(); break
      }
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

  private nextComp() { this.compIndex++; this.notify(); this.runComp() }
  getState(): VNState { return { ...this.state } }
}