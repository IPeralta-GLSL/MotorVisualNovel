import { useState } from 'react'
import SceneProperties from './SceneProperties'
import ProjectPanel from './ProjectPanel'
import { Settings, Layers } from 'lucide-react'

export default function Sidebar() {
  const [tab, setTab] = useState<'scene' | 'project'>('scene')
  return (
    <div className="flex w-80 flex-col border-l border-neutral-700 bg-[#252525]">
      <div className="flex border-b border-neutral-700">
        <button onClick={() => setTab('scene')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'scene' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Settings size={13} /> Propiedades
        </button>
        <button onClick={() => setTab('project')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'project' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Layers size={13} /> Proyecto
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'scene' && <SceneProperties />}
        {tab === 'project' && <ProjectPanel />}
      </div>
    </div>
  )
}