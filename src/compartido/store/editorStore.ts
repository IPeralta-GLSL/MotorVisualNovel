import { create } from 'zustand'
import type {
  NodoVisualNovel,
  AristaVisualNovel,
  TipoNodo,
  DatosNodo,
  Personaje,
  VariableJuego,
} from '@/compartido/tipos'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'

interface EstadoEditor {
  nodos: NodoVisualNovel[]
  aristas: AristaVisualNovel[]
  nodoSeleccionado: string | null
  personajes: Personaje[]
  variables: VariableJuego[]
  nombreProyecto: string

  setNodos: (nodos: NodoVisualNovel[]) => void
  setAristas: (aristas: AristaVisualNovel[]) => void
  onNodesChange: (changes: NodeChange<NodoVisualNovel>[]) => void
  onEdgesChange: (changes: EdgeChange<AristaVisualNovel>[]) => void
  onConnect: (connection: Connection) => void
  agregarNodo: (tipo: TipoNodo, position: { x: number; y: number }) => void
  eliminarNodo: (id: string) => void
  actualizarDatosNodo: (id: string, data: Partial<DatosNodo>) => void
  seleccionarNodo: (id: string | null) => void
  agregarPersonaje: (personaje: Personaje) => void
  eliminarPersonaje: (id: string) => void
  agregarVariable: (variable: VariableJuego) => void
  eliminarVariable: (nombre: string) => void
  setNombreProyecto: (nombre: string) => void
}

const datosPorDefecto: Record<TipoNodo, () => DatosNodo> = {
  inicioEscena: () => ({
    etiqueta: 'Inicio Escena',
    nombreEscena: 'Escena 1',
  }),
  dialogo: () => ({
    etiqueta: 'Diálogo',
    personaje: '',
    texto: 'Escribe el diálogo aquí...',
    expresion: 'neutral',
    posicionPersonaje: 'centro',
  }),
  eleccion: () => ({
    etiqueta: 'Elección',
    opciones: [
      { id: crypto.randomUUID(), texto: 'Opción 1' },
      { id: crypto.randomUUID(), texto: 'Opción 2' },
    ],
  }),
  reproducirAudio: () => ({
    etiqueta: 'Reproducir Audio',
    tipoAudio: 'musica',
    archivo: '',
    volumen: 0.5,
    loop: false,
  }),
  fondoEscenario: () => ({
    etiqueta: 'Fondo',
    archivo: '',
    transicion: 'fade',
    duracion: 1000,
  }),
  mostrarPersonaje: () => ({
    etiqueta: 'Personaje',
    personaje: '',
    expresion: 'neutral',
    posicion: 'centro',
    accion: 'mostrar',
  }),
  condicion: () => ({
    etiqueta: 'Condición',
    variable: '',
    operador: '==',
    valor: '',
  }),
  asignarVariable: () => ({
    etiqueta: 'Variable',
    nombreVariable: '',
    operacion: 'asignar',
    valor: '',
  }),
  espera: () => ({
    etiqueta: 'Espera',
    duracion: 1000,
  }),
  transicion: () => ({
    etiqueta: 'Transición',
    tipoTransicion: 'fade',
    duracion: 500,
  }),
  fin: () => ({
    etiqueta: 'Fin',
    tipoFin: 'finEscena',
  }),
}

const coloresNodo: Record<TipoNodo, string> = {
  inicioEscena: '#10b981',
  dialogo: '#6366f1',
  eleccion: '#f59e0b',
  reproducirAudio: '#8b5cf6',
  fondoEscenario: '#06b6d4',
  mostrarPersonaje: '#ec4899',
  condicion: '#f97316',
  asignarVariable: '#14b8a6',
  espera: '#64748b',
  transicion: '#a855f7',
  fin: '#ef4444',
}

export const useEditorStore = create<EstadoEditor>((set, get) => ({
  nodos: [],
  aristas: [],
  nodoSeleccionado: null,
  personajes: [],
  variables: [],
  nombreProyecto: 'Mi Novela Visual',

  setNodos: (nodos) => set({ nodos }),
  setAristas: (aristas) => set({ aristas }),

  onNodesChange: (changes) => {
    set({ nodos: applyNodeChanges(changes, get().nodos) as NodoVisualNovel[] })
  },

  onEdgesChange: (changes) => {
    set({ aristas: applyEdgeChanges(changes, get().aristas) })
  },

  onConnect: (connection) => {
    set({
      aristas: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        },
        get().aristas,
      ),
    })
  },

  agregarNodo: (tipo, position) => {
    const id = crypto.randomUUID()
    const datos = datosPorDefecto[tipo]()
    const nuevoNodo: NodoVisualNovel = {
      id,
      type: tipo,
      position,
      data: datos,
      style: {
        background: coloresNodo[tipo],
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '0',
        width: 220,
      },
    }
    set({ nodos: [...get().nodos, nuevoNodo] })
  },

  eliminarNodo: (id) => {
    set({
      nodos: get().nodos.filter((n) => n.id !== id),
      aristas: get().aristas.filter(
        (a) => a.source !== id && a.target !== id,
      ),
      nodoSeleccionado:
        get().nodoSeleccionado === id ? null : get().nodoSeleccionado,
    })
  },

  actualizarDatosNodo: (id, data) => {
    set({
      nodos: get().nodos.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    })
  },

  seleccionarNodo: (id) => set({ nodoSeleccionado: id }),

  agregarPersonaje: (personaje) => {
    set({ personajes: [...get().personajes, personaje] })
  },

  eliminarPersonaje: (id) => {
    set({ personajes: get().personajes.filter((p) => p.id !== id) })
  },

  agregarVariable: (variable) => {
    set({ variables: [...get().variables, variable] })
  },

  eliminarVariable: (nombre) => {
    set({ variables: get().variables.filter((v) => v.nombre !== nombre) })
  },

  setNombreProyecto: (nombre) => set({ nombreProyecto: nombre }),
}))

export { coloresNodo }