import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Film, MessageSquare, User, GitBranch, Music, HelpCircle, Variable, Clock, Layers, Flag, ImageIcon } from 'lucide-react'
import type { SceneData, ComponentType } from '@/shared/types'

const ICONS: Record<ComponentType, React.ReactNode> = {
  background: <ImageIcon size={10} />,
  dialog: <MessageSquare size={10} />,
  character: <User size={10} />,
  choice: <GitBranch size={10} />,
  audio: <Music size={10} />,
  condition: <HelpCircle size={10} />,
  variable: <Variable size={10} />,
  wait: <Clock size={10} />,
  transition: <Layers size={10} />,
  endScene: <Flag size={10} />,
}

const LABELS: Record<ComponentType, string> = {
  background: 'Fondo', dialog: 'Dialogo', character: 'Personaje', choice: 'Eleccion',
  audio: 'Audio', condition: 'Condicion', variable: 'Variable', wait: 'Espera',
  transition: 'Transicion', endScene: 'Fin',
}

export default function SceneNode({ data }: NodeProps) {
  const d = data as unknown as SceneData
  return (
    <div className="w-[260px] overflow-hidden rounded-2xl border-2 border-white/10 shadow-xl">
      <Handle type="target" position={Position.Left} className="!h-4 !w-4 !border-2 !border-white/40 !bg-white/20 hover:!bg-white/60 !left-[-8px]" />
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15"><Film size={14} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">Escena</p>
          <p className="text-sm font-semibold truncate">{d.label}</p>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">{d.components.length}</span>
      </div>
      {d.components.length > 0 && (
        <div className="space-y-0.5 border-b border-white/10 px-3 py-2">
          {d.components.slice(0, 4).map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-[10px]">
              <span className="opacity-70">{ICONS[c.type]}</span>
              <span className="truncate">{LABELS[c.type]}</span>
            </div>
          ))}
          {d.components.length > 4 && <p className="text-[10px] opacity-50 text-center">+{d.components.length - 4} mas</p>}
        </div>
      )}
      {d.description && <p className="px-4 py-2 text-[11px] opacity-60 line-clamp-2">{d.description}</p>}
      <Handle type="source" position={Position.Right} className="!h-4 !w-4 !border-2 !border-white/40 !bg-white/20 hover:!bg-white/60 !right-[-8px]" />
    </div>
  )
}