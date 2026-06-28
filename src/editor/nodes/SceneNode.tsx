import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Film, MessageSquare, User, GitBranch, Music, HelpCircle, Variable, Clock, Layers, Flag, ImageIcon } from 'lucide-react'
import type { SceneData, ComponentType } from '@/shared/types'

const IC: Record<ComponentType, React.ReactNode> = {
  background: <ImageIcon size={10} />, dialog: <MessageSquare size={10} />, character: <User size={10} />, choice: <GitBranch size={10} />,
  audio: <Music size={10} />, condition: <HelpCircle size={10} />, variable: <Variable size={10} />, wait: <Clock size={10} />,
  transition: <Layers size={10} />, endScene: <Flag size={10} />,
}
const LB: Record<ComponentType, string> = {
  background: 'Fondo', dialog: 'Dialogo', character: 'Personaje', choice: 'Eleccion', audio: 'Audio', condition: 'Condicion',
  variable: 'Variable', wait: 'Espera', transition: 'Transicion', endScene: 'Fin',
}
const HC = '!border-2 !border-white/50 !bg-white/20 hover:!bg-white/70 hover:scale-125 transition-all'

export default function SceneNode({ data }: NodeProps) {
  const d = data as unknown as SceneData
  const ch = d.components.filter((c) => c.type === 'choice')
  const co = d.components.filter((c) => c.type === 'condition')
  const multi = ch.length > 0 || co.length > 0
  return (
    <div className="w-[270px] overflow-hidden rounded-2xl border-2 border-white/15 bg-gradient-to-br from-white/5 to-white/[0.02] shadow-2xl shadow-black/30">
      <Handle type="target" position={Position.Left} id="in" className={`!h-4 !w-4 ${HC} !left-[-8px]`} />
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10"><Film size={15} className="opacity-80" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-50">Escena</p>
          <p className="text-sm font-bold truncate">{d.label}</p>
        </div>
        {d.components.length > 0 && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">{d.components.length}</span>}
      </div>
      {d.components.length > 0 && (
        <div className="space-y-0.5 border-b border-white/10 px-3 py-2.5">
          {d.components.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[10px]">
              <span className="opacity-60">{IC[c.type]}</span><span className="truncate font-medium">{LB[c.type]}</span>
            </div>
          ))}
          {d.components.length > 5 && <p className="text-center text-[10px] opacity-40">+{d.components.length - 5} mas</p>}
        </div>
      )}
      {d.description && <p className="border-b border-white/10 px-4 py-2 text-[11px] opacity-40 line-clamp-2 italic">{d.description}</p>}
      <div className="flex items-center justify-end gap-1 px-3 py-2">
        {ch.map((x) => <Handle key={x.id} type="source" position={Position.Right} id={`choice-${x.id}`} className={`!h-3.5 !w-3.5 ${HC}`} style={{ position: 'relative', right: 0, top: 0, transform: 'none' }} />)}
        {co.map((x) => <Handle key={x.id} type="source" position={Position.Right} id={`cond-true-${x.id}`} className={`!h-3.5 !w-3.5 ${HC}`} style={{ position: 'relative', right: 0, top: 0, transform: 'none' }} />)}
      </div>
      {!multi && <Handle type="source" position={Position.Right} id="out" className={`!h-4 !w-4 ${HC} !right-[-8px]`} />}
    </div>
  )
}