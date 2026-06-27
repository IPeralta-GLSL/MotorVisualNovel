import { useEditorStore } from '@/compartido/store/editorStore'
import type { TipoNodo, OpcionEleccion } from '@/compartido/tipos'
import {
  X, Plus, Trash2, Settings, Play, MessageSquare, GitBranch,
  Music, ImageIcon, User, HelpCircle, Variable, Clock, Layers, Flag,
} from 'lucide-react'

function CampoTexto({ etiqueta, valor, onChange }: { etiqueta: string; valor: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-neutral-400">{etiqueta}</label>
      <input type="text" value={valor} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-indigo-500" />
    </div>
  )
}

function CampoArea({ etiqueta, valor, onChange }: { etiqueta: string; valor: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-neutral-400">{etiqueta}</label>
      <textarea value={valor} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full resize-none rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-indigo-500" />
    </div>
  )
}

function CampoNumero({ etiqueta, valor, onChange, min, max }: { etiqueta: string; valor: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-neutral-400">{etiqueta}</label>
      <input type="number" value={valor} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={0.1}
        className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-indigo-500" />
    </div>
  )
}

function CampoSelect({ etiqueta, valor, opciones, onChange }: { etiqueta: string; valor: string; opciones: { valor: string; texto: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-neutral-400">{etiqueta}</label>
      <select value={valor} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-indigo-500">
        {opciones.map((op) => <option key={op.valor} value={op.valor}>{op.texto}</option>)}
      </select>
    </div>
  )
}

function CampoCheck({ etiqueta, valor, onChange }: { etiqueta: string; valor: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={valor} onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-indigo-500 focus:ring-indigo-500" />
      <span className="text-sm text-neutral-300">{etiqueta}</span>
    </label>
  )
}

function PropiedadesInicioEscena({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return <CampoTexto etiqueta="Nombre de Escena" valor={datos.nombreEscena as string} onChange={(v) => actualizar({ nombreEscena: v })} />
}

function PropiedadesDialogo({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoTexto etiqueta="Personaje" valor={datos.personaje as string} onChange={(v) => actualizar({ personaje: v })} />
      <CampoArea etiqueta="Texto" valor={datos.texto as string} onChange={(v) => actualizar({ texto: v })} />
      <CampoTexto etiqueta="Expresión" valor={datos.expresion as string} onChange={(v) => actualizar({ expresion: v })} />
      <CampoSelect etiqueta="Posición" valor={datos.posicionPersonaje as string}
        opciones={[{ valor: 'izquierda', texto: 'Izquierda' }, { valor: 'centro', texto: 'Centro' }, { valor: 'derecha', texto: 'Derecha' }]}
        onChange={(v) => actualizar({ posicionPersonaje: v })} />
    </>
  )
}

function PropiedadesEleccion({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  const opciones = datos.opciones as OpcionEleccion[]

  const agregarOpcion = () => {
    const nuevas = [...opciones, { id: crypto.randomUUID(), texto: `Opción ${opciones.length + 1}` }]
    actualizar({ opciones: nuevas })
  }

  const eliminarOpcion = (id: string) => {
    actualizar({ opciones: opciones.filter((o) => o.id !== id) })
  }

  const actualizarOpcion = (id: string, texto: string) => {
    actualizar({ opciones: opciones.map((o) => o.id === id ? { ...o, texto } : o) })
  }

  return (
    <div className="space-y-3">
      {opciones.map((op, i) => (
        <div key={op.id} className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold">{i + 1}</span>
          <input type="text" value={op.texto} onChange={(e) => actualizarOpcion(op.id, e.target.value)}
            className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-amber-500" />
          {opciones.length > 1 && (
            <button onClick={() => eliminarOpcion(op.id)} className="rounded p-1 text-neutral-500 hover:bg-red-900/30 hover:text-red-400">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
      <button onClick={agregarOpcion} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-600 py-2 text-xs text-neutral-400 transition-colors hover:border-amber-500 hover:text-amber-400">
        <Plus size={12} /> Agregar opción
      </button>
    </div>
  )
}

function PropiedadesReproducirAudio({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoSelect etiqueta="Tipo" valor={datos.tipoAudio as string}
        opciones={[{ valor: 'musica', texto: 'Música' }, { valor: 'efecto', texto: 'Efecto de sonido' }]}
        onChange={(v) => actualizar({ tipoAudio: v })} />
      <CampoTexto etiqueta="Archivo" valor={datos.archivo as string} onChange={(v) => actualizar({ archivo: v })} />
      <CampoNumero etiqueta="Volumen" valor={datos.volumen as number} onChange={(v) => actualizar({ volumen: v })} min={0} max={1} />
      <CampoCheck etiqueta="Repetir (loop)" valor={datos.loop as boolean} onChange={(v) => actualizar({ loop: v })} />
    </>
  )
}

function PropiedadesFondoEscenario({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoTexto etiqueta="Archivo de imagen" valor={datos.archivo as string} onChange={(v) => actualizar({ archivo: v })} />
      <CampoSelect etiqueta="Transición" valor={datos.transicion as string}
        opciones={[{ valor: 'ninguna', texto: 'Ninguna' }, { valor: 'fade', texto: 'Fade' }, { valor: 'dissolve', texto: 'Disolver' }, { valor: 'cut', texto: 'Corte' }]}
        onChange={(v) => actualizar({ transicion: v })} />
      <CampoNumero etiqueta="Duración (ms)" valor={datos.duracion as number} onChange={(v) => actualizar({ duracion: v })} min={0} />
    </>
  )
}

function PropiedadesMostrarPersonaje({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoTexto etiqueta="Personaje" valor={datos.personaje as string} onChange={(v) => actualizar({ personaje: v })} />
      <CampoSelect etiqueta="Acción" valor={datos.accion as string}
        opciones={[{ valor: 'mostrar', texto: 'Mostrar' }, { valor: 'ocultar', texto: 'Ocultar' }, { valor: 'mover', texto: 'Mover' }]}
        onChange={(v) => actualizar({ accion: v })} />
      <CampoTexto etiqueta="Expresión" valor={datos.expresion as string} onChange={(v) => actualizar({ expresion: v })} />
      <CampoSelect etiqueta="Posición" valor={datos.posicion as string}
        opciones={[{ valor: 'izquierda', texto: 'Izquierda' }, { valor: 'centro', texto: 'Centro' }, { valor: 'derecha', texto: 'Derecha' }]}
        onChange={(v) => actualizar({ posicion: v })} />
    </>
  )
}

function PropiedadesCondicion({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoTexto etiqueta="Variable" valor={datos.variable as string} onChange={(v) => actualizar({ variable: v })} />
      <CampoSelect etiqueta="Operador" valor={datos.operador as string}
        opciones={[{ valor: '==', texto: 'Igual (==)' }, { valor: '!=', texto: 'Diferente (!=)' }, { valor: '>', texto: 'Mayor (>)' }, { valor: '<', texto: 'Menor (<)' }, { valor: '>=', texto: 'Mayor o Igual (>=)' }, { valor: '<=', texto: 'Menor o Igual (<=)' }]}
        onChange={(v) => actualizar({ operador: v })} />
      <CampoTexto etiqueta="Valor" valor={datos.valor as string} onChange={(v) => actualizar({ valor: v })} />
    </>
  )
}

function PropiedadesAsignarVariable({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoTexto etiqueta="Nombre Variable" valor={datos.nombreVariable as string} onChange={(v) => actualizar({ nombreVariable: v })} />
      <CampoSelect etiqueta="Operación" valor={datos.operacion as string}
        opciones={[{ valor: 'asignar', texto: 'Asignar (=)' }, { valor: 'sumar', texto: 'Sumar (+=)' }, { valor: 'restar', texto: 'Restar (-=)' }]}
        onChange={(v) => actualizar({ operacion: v })} />
      <CampoTexto etiqueta="Valor" valor={datos.valor as string} onChange={(v) => actualizar({ valor: v })} />
    </>
  )
}

function PropiedadesEspera({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return <CampoNumero etiqueta="Duración (ms)" valor={datos.duracion as number} onChange={(v) => actualizar({ duracion: v })} min={0} />
}

function PropiedadesTransicion({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <>
      <CampoSelect etiqueta="Tipo" valor={datos.tipoTransicion as string}
        opciones={[{ valor: 'fade', texto: 'Fade' }, { valor: 'dissolve', texto: 'Disolver' }, { valor: 'cut', texto: 'Corte' }, { valor: 'slide', texto: 'Deslizar' }]}
        onChange={(v) => actualizar({ tipoTransicion: v })} />
      <CampoNumero etiqueta="Duración (ms)" valor={datos.duracion as number} onChange={(v) => actualizar({ duracion: v })} min={0} />
      {datos.tipoTransicion === 'slide' && (
        <CampoSelect etiqueta="Dirección" valor={(datos.direccion as string) || 'derecha'}
          opciones={[{ valor: 'arriba', texto: 'Arriba' }, { valor: 'abajo', texto: 'Abajo' }, { valor: 'izquierda', texto: 'Izquierda' }, { valor: 'derecha', texto: 'Derecha' }]}
          onChange={(v) => actualizar({ direccion: v })} />
      )}
    </>
  )
}

function PropiedadesFin({ datos, actualizar }: { datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }) {
  return (
    <CampoSelect etiqueta="Tipo de fin" valor={datos.tipoFin as string}
      opciones={[{ valor: 'finEscena', texto: 'Fin de Escena' }, { valor: 'finJuego', texto: 'Fin del Juego' }]}
      onChange={(v) => actualizar({ tipoFin: v })} />
  )
}

const renderizadores: Record<TipoNodo, React.FC<{ datos: Record<string, unknown>; actualizar: (d: Record<string, unknown>) => void }>> = {
  inicioEscena: PropiedadesInicioEscena,
  dialogo: PropiedadesDialogo,
  eleccion: PropiedadesEleccion,
  reproducirAudio: PropiedadesReproducirAudio,
  fondoEscenario: PropiedadesFondoEscenario,
  mostrarPersonaje: PropiedadesMostrarPersonaje,
  condicion: PropiedadesCondicion,
  asignarVariable: PropiedadesAsignarVariable,
  espera: PropiedadesEspera,
  transicion: PropiedadesTransicion,
  fin: PropiedadesFin,
}

import type { LucideIcon } from 'lucide-react'

const titulosNodo: Record<TipoNodo, { nombre: string; Icono: LucideIcon }> = {
  inicioEscena: { nombre: 'Inicio de Escena', Icono: Play },
  dialogo: { nombre: 'Diálogo', Icono: MessageSquare },
  eleccion: { nombre: 'Elección', Icono: GitBranch },
  reproducirAudio: { nombre: 'Audio', Icono: Music },
  fondoEscenario: { nombre: 'Fondo', Icono: ImageIcon },
  mostrarPersonaje: { nombre: 'Personaje', Icono: User },
  condicion: { nombre: 'Condición', Icono: HelpCircle },
  asignarVariable: { nombre: 'Variable', Icono: Variable },
  espera: { nombre: 'Espera', Icono: Clock },
  transicion: { nombre: 'Transición', Icono: Layers },
  fin: { nombre: 'Fin', Icono: Flag },
}

export default function PanelPropiedades() {
  const nodoSeleccionado = useEditorStore((s) => s.nodoSeleccionado)
  const nodos = useEditorStore((s) => s.nodos)
  const actualizarDatosNodo = useEditorStore((s) => s.actualizarDatosNodo)
  const seleccionarNodo = useEditorStore((s) => s.seleccionarNodo)

  const nodo = nodos.find((n) => n.id === nodoSeleccionado)

  if (!nodo) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="rounded-2xl bg-neutral-800 p-4">
          <Settings size={32} className="text-neutral-600" />
        </div>
        <p className="text-sm text-neutral-500">Seleccioná un nodo para ver sus propiedades</p>
      </div>
    )
  }

  const actualizar = (data: Record<string, unknown>) => actualizarDatosNodo(nodo.id, data)
  const Renderizador = renderizadores[nodo.type]

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(() => { const t = titulosNodo[nodo.type]; return <><t.Icono size={14} /><span className="text-sm font-bold text-neutral-200">{t.nombre}</span></> })()}
        </div>
        <button onClick={() => seleccionarNodo(null)}
          className="rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300">
          <X size={14} />
        </button>
      </div>
      <CampoTexto etiqueta="Nombre" valor={nodo.data.etiqueta} onChange={(v) => actualizar({ etiqueta: v })} />
      {Renderizador && <Renderizador datos={nodo.data as unknown as Record<string, unknown>} actualizar={actualizar} />}
    </div>
  )
}