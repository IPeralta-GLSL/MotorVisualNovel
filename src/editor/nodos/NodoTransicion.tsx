import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Layers } from 'lucide-react'
import type { DatosTransicion } from '@/compartido/tipos'

export default function NodoTransicion({ data }: NodeProps) {
  const datos = data as unknown as DatosTransicion

  return (
    <div className="min-w-[180px] overflow-hidden rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-purple-600" />
      <div className="flex items-center gap-2 bg-purple-600 px-4 py-2">
        <Layers size={16} />
        <span className="text-sm font-bold">TRANSICIÓN</span>
      </div>
      <div className="bg-purple-700/50 px-4 py-3 space-y-1">
        <p className="text-sm text-purple-100 capitalize">{datos.tipoTransicion}</p>
        <p className="text-xs text-purple-300">{datos.duracion}ms</p>
        {datos.direccion && (
          <p className="text-xs text-purple-300">Dir: {datos.direccion}</p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !border-purple-600" />
    </div>
  )
}