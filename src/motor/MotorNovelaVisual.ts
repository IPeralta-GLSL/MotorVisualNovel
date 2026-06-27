import type { NodoVisualNovel, AristaVisualNovel } from '@/compartido/tipos'

export interface EstadoMotor {
  nodoActual: string | null
  variables: Record<string, string>
  personajesVisibles: { id: string; expresion: string; posicion: string }[]
  fondoActual: string
  musicaActual: string
  textoDialogo: { personaje: string; texto: string; expresion: string } | null
  opcionesEleccion: { id: string; texto: string }[] | null
  esperandoInput: boolean
  enEjecucion: boolean
}

export type ListenerMotor = (estado: EstadoMotor) => void

export class MotorNovelaVisual {
  private nodos: NodoVisualNovel[]
  private aristas: AristaVisualNovel[]
  private variables: Record<string, string> = {}
  private estado: EstadoMotor
  private listeners: ListenerMotor[] = []
  private timerEspera: ReturnType<typeof setTimeout> | null = null

  constructor(nodos: NodoVisualNovel[], aristas: AristaVisualNovel[]) {
    this.nodos = nodos
    this.aristas = aristas
    this.estado = { nodoActual: null, variables: {}, personajesVisibles: [], fondoActual: '', musicaActual: '', textoDialogo: null, opcionesEleccion: null, esperandoInput: false, enEjecucion: false }
  }

  suscribir(listener: ListenerMotor) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter((l) => l !== listener) }
  }

  private notificar() { this.listeners.forEach((l) => l({ ...this.estado })) }

  private obtenerSiguiente(id: string, handle?: string): NodoVisualNovel | null {
    const arista = this.aristas.find((a) => a.source === id && (handle ? a.sourceHandle === handle : true))
    return arista ? (this.nodos.find((n) => n.id === arista.target) || null) : null
  }

  iniciar() {
    const inicio = this.nodos.find((n) => n.type === 'inicioEscena')
    if (!inicio) return
    this.estado = { nodoActual: inicio.id, variables: {}, personajesVisibles: [], fondoActual: '', musicaActual: '', textoDialogo: null, opcionesEleccion: null, esperandoInput: false, enEjecucion: true }
    this.notificar()
    this.ejecutarNodo(inicio)
  }

  detener() {
    if (this.timerEspera) clearTimeout(this.timerEspera)
    this.estado = { nodoActual: null, variables: {}, personajesVisibles: [], fondoActual: '', musicaActual: '', textoDialogo: null, opcionesEleccion: null, esperandoInput: false, enEjecucion: false }
    this.notificar()
  }

  avanzar() {
    if (!this.estado.esperandoInput || !this.estado.nodoActual || !this.estado.textoDialogo) return
    this.estado.textoDialogo = null
    const siguiente = this.obtenerSiguiente(this.estado.nodoActual)
    if (siguiente) { this.estado.nodoActual = siguiente.id; this.estado.esperandoInput = false; this.notificar(); this.ejecutarNodo(siguiente) }
  }

  seleccionarOpcion(opcionId: string) {
    if (!this.estado.opcionesEleccion || !this.estado.nodoActual) return
    const arista = this.aristas.find((a) => a.source === this.estado.nodoActual && a.sourceHandle === `opcion-${opcionId}`)
    if (!arista) return
    const siguiente = this.nodos.find((n) => n.id === arista.target)
    if (!siguiente) return
    this.estado.opcionesEleccion = null; this.estado.nodoActual = siguiente.id; this.estado.esperandoInput = false
    this.notificar(); this.ejecutarNodo(siguiente)
  }

  private ejecutarNodo(nodo: NodoVisualNovel) {
    const d = nodo.data as Record<string, unknown>
    switch (nodo.type) {
      case 'inicioEscena': this.continuar(nodo.id); break
      case 'dialogo':
        this.estado.textoDialogo = { personaje: (d.personaje as string) || '???', texto: (d.texto as string) || '', expresion: (d.expresion as string) || 'neutral' }
        this.estado.esperandoInput = true; this.notificar(); break
      case 'eleccion':
        this.estado.opcionesEleccion = (d.opciones as { id: string; texto: string }[]).map((op) => ({ id: op.id, texto: op.texto }))
        this.estado.esperandoInput = true; this.notificar(); break
      case 'mostrarPersonaje': {
        const p = d.personaje as string, a = d.accion as string
        if (a === 'mostrar') this.estado.personajesVisibles = [...this.estado.personajesVisibles.filter((x) => x.id !== p), { id: p, expresion: (d.expresion as string) || 'neutral', posicion: (d.posicion as string) || 'centro' }]
        else if (a === 'ocultar') this.estado.personajesVisibles = this.estado.personajesVisibles.filter((x) => x.id !== p)
        else if (a === 'mover') this.estado.personajesVisibles = this.estado.personajesVisibles.map((x) => x.id === p ? { ...x, posicion: (d.posicion as string) || 'centro', expresion: (d.expresion as string) || x.expresion } : x)
        this.notificar(); this.continuar(nodo.id); break
      }
      case 'fondoEscenario': this.estado.fondoActual = (d.archivo as string) || ''; this.notificar(); this.continuar(nodo.id); break
      case 'reproducirAudio': this.estado.musicaActual = (d.archivo as string) || ''; this.notificar(); this.continuar(nodo.id); break
      case 'asignarVariable': {
        const n = d.nombreVariable as string
        if (n) {
          const act = Number(this.variables[n]) || 0, nv = Number(d.valor as string) || 0
          if (d.operacion === 'asignar') this.variables[n] = d.valor as string
          else if (d.operacion === 'sumar') this.variables[n] = String(act + nv)
          else if (d.operacion === 'restar') this.variables[n] = String(act - nv)
          this.estado.variables = { ...this.variables }
        }
        this.notificar(); this.continuar(nodo.id); break
      }
      case 'condicion': {
        const v = this.variables[(d.variable as string)] || '', op = d.operador as string, val = d.valor as string
        let r = false; const nv = Number(v), nval = Number(val)
        if (op === '==') r = v === val; else if (op === '!=') r = v !== val
        else if (op === '>') r = nv > nval; else if (op === '<') r = nv < nval
        else if (op === '>=') r = nv >= nval; else if (op === '<=') r = nv <= nval
        const sig = this.obtenerSiguiente(nodo.id, r ? 'verdadero' : 'falso')
        if (sig) { this.estado.nodoActual = sig.id; this.notificar(); this.ejecutarNodo(sig) }
        break
      }
      case 'espera': this.timerEspera = setTimeout(() => this.continuar(nodo.id), (d.duracion as number) || 1000); break
      case 'transicion': this.continuar(nodo.id); break
      case 'fin': this.estado.enEjecucion = false; this.estado.esperandoInput = false; this.notificar(); break
      default: this.continuar(nodo.id); break
    }
  }

  private continuar(id: string) {
    const sig = this.obtenerSiguiente(id)
    if (sig) { this.estado.nodoActual = sig.id; this.notificar(); this.ejecutarNodo(sig) }
  }

  obtenerEstado(): EstadoMotor { return { ...this.estado } }
}