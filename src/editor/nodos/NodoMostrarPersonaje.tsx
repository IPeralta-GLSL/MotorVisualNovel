import { Handle, Position, type NodeProps } from '@xyflow/react'
import { User } from 'lucide-react'
import type { DatosMostrarPersonaje } from '@/compartido/tipos'

export default function NodoMostrarPersonaje({ data }: NodeProps) {
  const datos = data as unknown as DatosMostrarPersonaje

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-pink-400/30 shadow-lg shadow-pink-500/20">
      <Handle type="target" position={Position.Top} className="!bg-pink-400 !border-pink-600" />
      <div className="flex items-center gap-2 bg-pink-600 px-4 py-2">
        <User size={16} />
        <span className="text-sm font-bold">PERSONAJE</span>
      </div>
      <div className="bg-pink-700/50 px-4 py-3 space-y-1">
        <p className="text-sm font-medium text-pink-100">{datos.personaje || 'Sin nombre'}</p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-pink-300">
          <span className="rounded bg-pink-600/50 px-1.5 py-0.5">{datos.accion}</span>
          <span className="rounded bg-pink-600/50 px-1.5 py-0.5">{datos.expresion}</span>
          <span className="rounded bg-pink-600/50 px-1.5 py-0.5">{datos.posicion}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-pink-400 !border-pink-600" />
    </div>
  )
}