import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Flag } from 'lucide-react'
import type { DatosFin } from '@/compartido/tipos'

export default function NodoFin({ data }: NodeProps) {
  const datos = data as unknown as DatosFin

  return (
    <div className="min-w-[180px] overflow-hidden rounded-xl border border-red-400/30 shadow-lg shadow-red-500/20">
      <Handle type="target" position={Position.Top} className="!bg-red-400 !border-red-600" />
      <div className="flex items-center gap-2 bg-red-600 px-4 py-2">
        <Flag size={16} />
        <span className="text-sm font-bold">FIN</span>
      </div>
      <div className="bg-red-700/50 px-4 py-3">
        <p className="text-sm text-red-100">
          {datos.tipoFin === 'finEscena' ? 'Fin de Escena' : 'Fin del Juego'}
        </p>
      </div>
    </div>
  )
}