import { useState, useCallback, useRef, useEffect } from 'react'
import { useEditorStore } from '@/compartido/store/editorStore'
import { useReactFlow } from '@xyflow/react'
import type { TipoNodo } from '@/compartido/tipos'
import {
  Play, MessageSquare, GitBranch, Music, ImageIcon, User,
  HelpCircle, Variable, Clock, Layers, Flag, Plus,
  Download, Upload, ZoomIn, ZoomOut, Maximize, Trash2, PlayCircle,
} from 'lucide-react'

interface NodoDisponible {
  tipo: TipoNodo
  nombre: string
  icono: React.ReactNode
  color: string
  descripcion: string
}

const nodosDisponibles: NodoDisponible[] = [
  { tipo: 'inicioEscena', nombre: 'Inicio Escena', icono: <Play size={18} />, color: 'bg-emerald-600 hover:bg-emerald-500', descripcion: 'Punto de entrada de una escena' },
  { tipo: 'dialogo', nombre: 'Diálogo', icono: <MessageSquare size={18} />, color: 'bg-indigo-600 hover:bg-indigo-500', descripcion: 'Texto de un personaje' },
  { tipo: 'eleccion', nombre: 'Elección', icono: <GitBranch size={18} />, color: 'bg-amber-600 hover:bg-amber-500', descripcion: 'Decisión del jugador' },
  { tipo: 'mostrarPersonaje', nombre: 'Personaje', icono: <User size={18} />, color: 'bg-pink-600 hover:bg-pink-500', descripcion: 'Mostrar/ocultar personaje' },
  { tipo: 'fondoEscenario', nombre: 'Fondo', icono: <ImageIcon size={18} />, color: 'bg-cyan-600 hover:bg-cyan-500', descripcion: 'Cambiar fondo de escena' },
  { tipo: 'reproducirAudio', nombre: 'Audio', icono: <Music size={18} />, color: 'bg-violet-600 hover:bg-violet-500', descripcion: 'Reproducir música o efecto' },
  { tipo: 'condicion', nombre: 'Condición', icono: <HelpCircle size={18} />, color: 'bg-orange-600 hover:bg-orange-500', descripcion: 'Evaluar variable' },
  { tipo: 'asignarVariable', nombre: 'Variable', icono: <Variable size={18} />, color: 'bg-teal-600 hover:bg-teal-500', descripcion: 'Modificar variable' },
  { tipo: 'espera', nombre: 'Espera', icono: <Clock size={18} />, color: 'bg-slate-600 hover:bg-slate-500', descripcion: 'Pausa con duración' },
  { tipo: 'transicion', nombre: 'Transición', icono: <Layers size={18} />, color: 'bg-purple-600 hover:bg-purple-500', descripcion: 'Efecto entre escenas' },
  { tipo: 'fin', nombre: 'Fin', icono: <Flag size={18} />, color: 'bg-red-600 hover:bg-red-500', descripcion: 'Fin de escena o juego' },
]

interface Props { onJugar: () => void }

export default function BarraHerramientas({ onJugar }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { agregarNodo, nombreProyecto, nodos, aristas, setNodos, setAristas } = useEditorStore()
  const reactFlow = useReactFlow()

  useEffect(() => {
    const handleClickAfuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickAfuera)
    return () => document.removeEventListener('mousedown', handleClickAfuera)
  }, [])

  const handleAgregarNodo = useCallback(
    (tipo: TipoNodo) => {
      const viewport = reactFlow.getViewport()
      const posicion = {
        x: (400 - viewport.x) / viewport.zoom,
        y: (300 - viewport.y) / viewport.zoom,
      }
      agregarNodo(tipo, posicion)
      setMenuAbierto(false)
    },
    [agregarNodo, reactFlow],
  )

  const handleExportar = useCallback(() => {
    const proyecto = { nombre: nombreProyecto, version: '1.0.0', nodos, aristas, fecha: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(proyecto, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${nombreProyecto.replace(/\s+/g, '_')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [nombreProyecto, nodos, aristas])

  const handleImportar = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.nodos) setNodos(data.nodos)
          if (data.aristas) setAristas(data.aristas)
        } catch { alert('Error al importar el archivo') }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [setNodos, setAristas])

  const handleEliminarSeleccionado = useCallback(() => {
    const { nodoSeleccionado, eliminarNodo } = useEditorStore.getState()
    if (nodoSeleccionado) eliminarNodo(nodoSeleccionado)
  }, [])

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-700 bg-[#252525] px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-sm font-bold">VN</span>
          </div>
          <span className="text-sm font-semibold text-neutral-200">{nombreProyecto}</span>
        </div>

        <div className="mx-2 h-6 w-px bg-neutral-600" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Plus size={14} />
            Agregar Nodo
          </button>

          {menuAbierto && (
            <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-neutral-600 bg-[#2a2a2a] p-2 shadow-2xl">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Seleccionar tipo de nodo
              </p>
              <div className="space-y-1">
                {nodosDisponibles.map((nodo) => (
                  <button
                    key={nodo.tipo}
                    onClick={() => handleAgregarNodo(nodo.tipo)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${nodo.color}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      {nodo.icono}
                    </span>
                    <div>
                      <p className="font-medium text-white">{nodo.nombre}</p>
                      <p className="text-xs text-white/60">{nodo.descripcion}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => reactFlow.zoomIn()} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200" title="Acercar">
          <ZoomIn size={16} />
        </button>
        <button onClick={() => reactFlow.zoomOut()} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200" title="Alejar">
          <ZoomOut size={16} />
        </button>
        <button onClick={() => reactFlow.fitView({ padding: 0.2 })} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200" title="Ajustar vista">
          <Maximize size={16} />
        </button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={handleEliminarSeleccionado} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-900/50 hover:text-red-400" title="Eliminar nodo seleccionado">
          <Trash2 size={16} />
        </button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={onJugar} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-500" title="Ejecutar juego">
          <PlayCircle size={14} />
          Jugar
        </button>
        <div className="mx-1 h-6 w-px bg-neutral-600" />
        <button onClick={handleExportar} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200" title="Exportar proyecto">
          <Download size={16} />
        </button>
        <button onClick={handleImportar} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200" title="Importar proyecto">
          <Upload size={16} />
        </button>
      </div>
    </div>
  )
}