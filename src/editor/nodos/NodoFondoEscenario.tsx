import { Handle, Position, type NodeProps } from '@xyflow/react'
import { ImageIcon } from 'lucide-react'
import type { DatosFondoEscenario } from '@/compartido/tipos'

export default function NodoFondoEscenario({ data }: NodeProps) {
  const datos = data as unknown as DatosFondoEscenario

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !border-cyan-600" />
      <div className="flex items-center gap-2 bg-cyan-600 px-4 py-2">
        <ImageIcon size={16} />
        <span className="text-sm font-bold">FONDO</span>
      </div>
      <div className="bg-cyan-700/50 px-4 py-3 space-y-1">
        <p className="text-sm text-cyan-100">{datos.archivo || 'Sin imagen'}</p>
        <div className="flex items-center gap-2 text-xs text-cyan-300">
          <span className="rounded bg-cyan-600/50 px-1.5 py-0.5">{datos.transicion}</span>
          <span>{datos.duracion}ms</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !border-cyan-600" />
    </div>
  )
}