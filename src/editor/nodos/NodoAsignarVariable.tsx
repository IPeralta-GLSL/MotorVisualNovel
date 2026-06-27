import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Variable } from 'lucide-react'
import type { DatosAsignarVariable } from '@/compartido/tipos'

export default function NodoAsignarVariable({ data }: NodeProps) {
  const datos = data as unknown as DatosAsignarVariable

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-teal-400/30 shadow-lg shadow-teal-500/20">
      <Handle type="target" position={Position.Top} className="!bg-teal-400 !border-teal-600" />
      <div className="flex items-center gap-2 bg-teal-600 px-4 py-2">
        <Variable size={16} />
        <span className="text-sm font-bold">VARIABLE</span>
      </div>
      <div className="bg-teal-700/50 px-4 py-3 space-y-1">
        <p className="text-sm font-mono text-teal-100">
          {datos.nombreVariable || 'nombre_variable'}
        </p>
        <div className="flex items-center gap-2 text-xs text-teal-300">
          <span className="rounded bg-teal-600/50 px-1.5 py-0.5">{datos.operacion}</span>
          <span className="font-mono">{datos.valor || '0'}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-teal-400 !border-teal-600" />
    </div>
  )
}