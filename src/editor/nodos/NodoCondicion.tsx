import { Handle, Position, type NodeProps } from '@xyflow/react'
import { HelpCircle } from 'lucide-react'
import type { DatosCondicion } from '@/compartido/tipos'

export default function NodoCondicion({ data }: NodeProps) {
  const datos = data as unknown as DatosCondicion

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-orange-400/30 shadow-lg shadow-orange-500/20">
      <Handle type="target" position={Position.Top} className="!bg-orange-400 !border-orange-600" />
      <div className="flex items-center gap-2 bg-orange-600 px-4 py-2">
        <HelpCircle size={16} />
        <span className="text-sm font-bold">CONDICIÓN</span>
      </div>
      <div className="bg-orange-700/50 px-4 py-3 space-y-2">
        <div className="flex items-center gap-1 text-sm text-orange-100">
          <span className="rounded bg-orange-600/50 px-1.5 py-0.5 font-mono text-xs">
            {datos.variable || 'var'}
          </span>
          <span className="font-bold">{datos.operador}</span>
          <span className="rounded bg-orange-600/50 px-1.5 py-0.5 font-mono text-xs">
            {datos.valor || 'valor'}
          </span>
        </div>
        <div className="flex justify-between text-xs text-orange-300">
          <span>✓ Verdadero</span>
          <span>✗ Falso</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="verdadero"
        className="!bg-green-400 !border-green-600"
        style={{ left: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="falso"
        className="!bg-red-400 !border-red-600"
        style={{ left: '70%' }}
      />
    </div>
  )
}