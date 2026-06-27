import { Handle, Position, type NodeProps } from '@xyflow/react'
import { GitBranch } from 'lucide-react'
import type { DatosEleccion } from '@/compartido/tipos'

export default function NodoEleccion({ data }: NodeProps) {
  const datos = data as unknown as DatosEleccion

  return (
    <div className="min-w-[220px] max-w-[260px] overflow-hidden rounded-xl border border-amber-400/30 shadow-lg shadow-amber-500/20">
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !border-amber-600" />
      <div className="flex items-center gap-2 bg-amber-600 px-4 py-2">
        <GitBranch size={16} />
        <span className="text-sm font-bold">ELECCIÓN</span>
      </div>
      <div className="bg-amber-700/50 px-4 py-3 space-y-2">
        {datos.opciones.map((opcion, index) => (
          <div
            key={opcion.id}
            className="relative flex items-center rounded-lg bg-amber-600/40 px-3 py-2 text-sm"
          >
            <span className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold">
              {index + 1}
            </span>
            <span className="text-amber-100 line-clamp-2">{opcion.texto}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={`opcion-${opcion.id}`}
              className="!bg-amber-400 !border-amber-600 !right-[-8px]"
              style={{ top: 'auto' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}