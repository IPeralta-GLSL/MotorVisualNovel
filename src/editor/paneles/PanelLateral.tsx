import { useEditorStore } from '@/compartido/store/editorStore'
import PanelPropiedades from './PanelPropiedades'
import PanelProyecto from './PanelProyecto'
import { Settings, Layers } from 'lucide-react'
import { useState } from 'react'

type TabPanel = 'propiedades' | 'proyecto'

export default function PanelLateral() {
  const nodoSeleccionado = useEditorStore((s) => s.nodoSeleccionado)
  const [tabActiva, setTabActiva] = useState<TabPanel>('propiedades')

  return (
    <div className="flex w-80 flex-col border-l border-neutral-700 bg-[#252525]">
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setTabActiva('propiedades')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tabActiva === 'propiedades'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Settings size={14} />
          Propiedades
        </button>
        <button
          onClick={() => setTabActiva('proyecto')}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tabActiva === 'proyecto'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Layers size={14} />
          Proyecto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tabActiva === 'propiedades' && <PanelPropiedades />}
        {tabActiva === 'proyecto' && <PanelProyecto />}
      </div>
    </div>
  )
}