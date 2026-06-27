import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Music, Volume2 } from 'lucide-react'
import type { DatosReproducirAudio } from '@/compartido/tipos'

export default function NodoReproducirAudio({ data }: NodeProps) {
  const datos = data as unknown as DatosReproducirAudio

  return (
    <div className="min-w-[200px] overflow-hidden rounded-xl border border-violet-400/30 shadow-lg shadow-violet-500/20">
      <Handle type="target" position={Position.Top} className="!bg-violet-400 !border-violet-600" />
      <div className="flex items-center gap-2 bg-violet-600 px-4 py-2">
        {datos.tipoAudio === 'musica' ? <Music size={16} /> : <Volume2 size={16} />}
        <span className="text-sm font-bold">AUDIO</span>
      </div>
      <div className="bg-violet-700/50 px-4 py-3 space-y-1">
        <p className="text-xs text-violet-300 uppercase">{datos.tipoAudio}</p>
        <p className="text-sm text-violet-100">{datos.archivo || 'Sin archivo'}</p>
        <div className="flex items-center gap-2 text-xs text-violet-300">
          <span>Vol: {Math.round(datos.volumen * 100)}%</span>
          {datos.loop && <span className="rounded bg-violet-600/50 px-1">Loop</span>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-violet-400 !border-violet-600" />
    </div>
  )
}