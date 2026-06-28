import { useState, useEffect, useRef } from 'react'
import LiteGraphProperties from './LiteGraphProperties'
import ProjectPanel from './ProjectPanel'
import { Settings, Layers } from 'lucide-react'

export default function Sidebar() {
  const [tab, setTab] = useState<'node' | 'project'>('node')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const stop = (e: Event) => {
      if (el.contains(e.target as Node)) {
        e.stopImmediatePropagation()
      }
    }

    const events = ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'pointermove']
    for (const evt of events) {
      document.addEventListener(evt, stop, true)
    }
    return () => {
      for (const evt of events) {
        document.removeEventListener(evt, stop, true)
      }
    }
  }, [])

  return (
    <div ref={ref} className="flex w-80 flex-col border-l border-neutral-700 bg-[#252525]">
      <div className="flex border-b border-neutral-700">
        <button onClick={() => setTab('node')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'node' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Settings size={13} /> Propiedades
        </button>
        <button onClick={() => setTab('project')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'project' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Layers size={13} /> Proyecto
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'node' && <LiteGraphProperties />}
        {tab === 'project' && <ProjectPanel />}
      </div>
    </div>
  )
}