import { useState } from 'react'
import { useEditorStore } from '@/compartido/store/editorStore'
import { Plus, Trash2, User, Variable } from 'lucide-react'

export default function PanelProyecto() {
  const { nombreProyecto, setNombreProyecto, personajes, agregarPersonaje, eliminarPersonaje, variables, agregarVariable, eliminarVariable } = useEditorStore()
  const [nuevoPersonaje, setNuevoPersonaje] = useState('')
  const [nuevaVariable, setNuevaVariable] = useState('')
  const [tabActiva, setTabActiva] = useState<'personajes' | 'variables'>('personajes')

  const handleAgregarPersonaje = () => {
    if (!nuevoPersonaje.trim()) return
    agregarPersonaje({ id: crypto.randomUUID(), nombre: nuevoPersonaje.trim(), color: `hsl(${Math.random() * 360}, 70%, 60%)`, expresiones: ['neutral', 'feliz', 'triste', 'enojado', 'sorprendido'] })
    setNuevoPersonaje('')
  }

  const handleAgregarVariable = () => {
    if (!nuevaVariable.trim()) return
    agregarVariable({ nombre: nuevaVariable.trim(), tipo: 'texto', valorInicial: '' })
    setNuevaVariable('')
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-400">Nombre del Proyecto</label>
        <input type="text" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)}
          className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none transition-colors focus:border-indigo-500" />
      </div>
      <div className="flex rounded-lg border border-neutral-600">
        <button onClick={() => setTabActiva('personajes')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${tabActiva === 'personajes' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>
          <User size={12} /> Personajes
        </button>
        <button onClick={() => setTabActiva('variables')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${tabActiva === 'variables' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>
          <Variable size={12} /> Variables
        </button>
      </div>
      {tabActiva === 'personajes' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input type="text" value={nuevoPersonaje} onChange={(e) => setNuevoPersonaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAgregarPersonaje()}
              placeholder="Nombre del personaje..."
              className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
            <button onClick={handleAgregarPersonaje} className="rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-500">
              <Plus size={16} />
            </button>
          </div>
          {personajes.length === 0 && <p className="text-center text-xs text-neutral-500 py-4">No hay personajes aún</p>}
          {personajes.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg bg-neutral-800 p-3">
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: p.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-200">{p.nombre}</p>
                <p className="text-xs text-neutral-500">{p.expresiones.length} expresiones</p>
              </div>
              <button onClick={() => eliminarPersonaje(p.id)} className="rounded p-1 text-neutral-500 hover:bg-red-900/30 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      {tabActiva === 'variables' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input type="text" value={nuevaVariable} onChange={(e) => setNuevaVariable(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAgregarVariable()}
              placeholder="Nombre de la variable..."
              className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
            <button onClick={handleAgregarVariable} className="rounded-lg bg-teal-600 p-2 text-white transition-colors hover:bg-teal-500">
              <Plus size={16} />
            </button>
          </div>
          {variables.length === 0 && <p className="text-center text-xs text-neutral-500 py-4">No hay variables aún</p>}
          {variables.map((v) => (
            <div key={v.nombre} className="flex items-center gap-3 rounded-lg bg-neutral-800 p-3">
              <span className="rounded bg-teal-600/30 px-2 py-1 text-xs font-mono text-teal-300">{v.tipo}</span>
              <p className="flex-1 text-sm font-medium text-neutral-200">{v.nombre}</p>
              <button onClick={() => eliminarVariable(v.nombre)} className="rounded p-1 text-neutral-500 hover:bg-red-900/30 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}