import { useState } from 'react'
import { useEditorStore } from '@/shared/store/editorStore'
import { Plus, Trash2, User, Variable } from 'lucide-react'

export default function ProjectPanel() {
  const { projectName, setProjectName, characters, addCharacter, removeCharacter, variables, addVariable, removeVariable } = useEditorStore()
  const [newChar, setNewChar] = useState('')
  const [newVar, setNewVar] = useState('')
  const [tab, setTab] = useState<'characters' | 'variables'>('characters')

  const handleAddChar = () => {
    if (!newChar.trim()) return
    addCharacter({ id: crypto.randomUUID(), name: newChar.trim(), color: `hsl(${Math.random() * 360},70%,60%)`, expressions: ['neutral', 'feliz', 'triste', 'enojado', 'sorprendido'] })
    setNewChar('')
  }

  const handleAddVar = () => {
    if (!newVar.trim()) return
    addVariable({ name: newVar.trim(), type: 'text', defaultValue: '' })
    setNewVar('')
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-neutral-400">Nombre del Proyecto</label>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)}
          className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
      </div>
      <div className="flex rounded-lg border border-neutral-700">
        <button onClick={() => setTab('characters')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${tab === 'characters' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>
          <User size={12} /> Personajes
        </button>
        <button onClick={() => setTab('variables')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold ${tab === 'variables' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>
          <Variable size={12} /> Variables
        </button>
      </div>
      {tab === 'characters' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input type="text" value={newChar} onChange={(e) => setNewChar(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddChar()}
              placeholder="Nombre..." className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
            <button onClick={handleAddChar} className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500"><Plus size={14} /></button>
          </div>
          {characters.length === 0 && <p className="text-center text-xs text-neutral-600 py-3">Sin personajes</p>}
          {characters.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 rounded-lg bg-neutral-800 p-2.5">
              <div className="h-7 w-7 rounded-full" style={{ background: c.color }} />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-neutral-200 truncate">{c.name}</p><p className="text-[10px] text-neutral-500">{c.expressions.length} expresiones</p></div>
              <button onClick={() => removeCharacter(c.id)} className="rounded p-1 text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
      {tab === 'variables' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input type="text" value={newVar} onChange={(e) => setNewVar(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddVar()}
              placeholder="Nombre..." className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
            <button onClick={handleAddVar} className="rounded-lg bg-teal-600 p-2 text-white hover:bg-teal-500"><Plus size={14} /></button>
          </div>
          {variables.length === 0 && <p className="text-center text-xs text-neutral-600 py-3">Sin variables</p>}
          {variables.map((v) => (
            <div key={v.name} className="flex items-center gap-2.5 rounded-lg bg-neutral-800 p-2.5">
              <span className="rounded bg-teal-600/30 px-1.5 py-0.5 text-[10px] font-mono text-teal-300">{v.type}</span>
              <p className="flex-1 text-sm font-medium text-neutral-200 truncate">{v.name}</p>
              <button onClick={() => removeVariable(v.name)} className="rounded p-1 text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}