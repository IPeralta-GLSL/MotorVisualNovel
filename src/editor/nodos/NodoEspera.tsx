import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Clock } from 'lucide-react'
import type { DatosEspera } from '@/compartido/tipos'

export default function NodoEspera({ data }: NodeProps) {
  const datos = data as unknown as DatosEspera

  return (
    <div className="min-w-[180px] overflow-hidden rounded-xl border border-slate-400/30 shadow-lg shadow-slate-500/20">
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !border-slate-600" />
      <div className="flex items-center gap-2 bg-slate-600 px-4 py-2">
        <Clock size={16} />
        <span className="text-sm font-bold">ESPERA</span>
      </div>
      <div className="bg-slate-700/50 px-4 py-3">
        <p className="text-sm text-slate-100">
          {datos.duracion >= 1000
            ? `${(datos.duracion / 1000).toFixed(1)}s`
            : `${datos.duracion}ms`}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !border-slate-600" />
    </div>
  )
}