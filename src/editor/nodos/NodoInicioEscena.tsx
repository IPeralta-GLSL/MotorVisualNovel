import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Play } from 'lucide-react'
import type { DatosInicioEscena } from '@/compartido/tipos'

export default function NodoInicioEscena({ data }: NodeProps) {
  const datos = data as unknown as DatosInicioEscena

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
      <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2">
        <Play size={16} />
        <span className="text-sm font-bold">INICIO ESCENA</span>
      </div>
      <div className="bg-emerald-700/50 px-4 py-3">
        <p className="text-xs text-emerald-100/70">Escena</p>
        <p className="text-sm font-medium">{datos.nombreEscena}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !border-emerald-600" />
    </div>
  )
}