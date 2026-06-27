import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MessageSquare } from 'lucide-react'
import type { DatosDialogo } from '@/compartido/tipos'

export default function NodoDialogo({ data }: NodeProps) {
  const datos = data as unknown as DatosDialogo

  return (
    <div className="min-w-[220px] max-w-[260px] overflow-hidden rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-500/20">
      <Handle type="target" position={Position.Top} className="!bg-indigo-400 !border-indigo-600" />
      <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2">
        <MessageSquare size={16} />
        <span className="text-sm font-bold">DIÁLOGO</span>
      </div>
      <div className="bg-indigo-700/50 px-4 py-3 space-y-2">
        {datos.personaje && (
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            {datos.personaje}
          </p>
        )}
        <p className="text-sm leading-relaxed text-indigo-100 line-clamp-3">
          {datos.texto || 'Escribe el diálogo...'}
        </p>
        <div className="flex items-center gap-2 text-xs text-indigo-300">
          <span className="rounded bg-indigo-600/50 px-1.5 py-0.5">{datos.expresion}</span>
          <span className="rounded bg-indigo-600/50 px-1.5 py-0.5">{datos.posicionPersonaje}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !border-indigo-600" />
    </div>
  )
}