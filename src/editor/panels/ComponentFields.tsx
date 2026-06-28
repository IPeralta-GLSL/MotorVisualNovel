import type { SceneComponent } from '@/shared/types'
import { useEditorStore } from '@/shared/store/editorStore'
import { Plus, Upload } from 'lucide-react'

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><label className="text-[11px] font-medium text-neutral-400">{label}</label>{children}</div>
}

const stop = { onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(), onKeyUp: (e: React.KeyboardEvent) => e.stopPropagation(), onFocus: (e: React.FocusEvent) => e.stopPropagation(), onMouseDown: (e: React.MouseEvent) => e.stopPropagation() }

function TI({ value, onChange, ph }: { value: string; onChange: (v: string) => void; ph?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} {...stop} placeholder={ph} className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
}

function TA({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} {...stop} rows={3} className="w-full resize-none rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
}

function NI({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} {...stop} min={min} max={max} step={0.1} className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500" />
}

function SL({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: { v: string; l: string }[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} {...stop} className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500">{opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
}

function CB({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return <label className="flex items-center gap-2" {...stop}><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-indigo-500" /><span className="text-sm text-neutral-300">{label}</span></label>
}

function CS({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const characters = useEditorStore((s) => s.characters)
  return <SL value={value} onChange={onChange} opts={[{ v: '', l: '-- Seleccionar --' }, ...characters.map((c) => ({ v: c.name, l: c.name }))]} />
}

function FU({ value, onChange, accept }: { value: string; onChange: (v: string) => void; accept: string }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { onChange(ev.target?.result as string) }
    reader.readAsDataURL(file)
  }
  return (
    <div className="space-y-1">
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-600 px-3 py-2 text-xs text-neutral-400 hover:border-indigo-500 hover:text-indigo-400" {...stop}>
        <Upload size={14} /><span>Subir archivo</span>
        <input type="file" accept={accept} onChange={handleFile} className="hidden" />
      </label>
      {value && <p className="truncate text-[10px] text-neutral-600">Archivo cargado</p>}
    </div>
  )
}

export default function ComponentFields({ comp, onUpdate }: { comp: SceneComponent; onUpdate: (p: Record<string, unknown>) => void }) {
  const p = comp.props
  switch (comp.type) {
    case 'background': return (<><F label="Color"><TI value={p.color as string || ''} onChange={(v) => onUpdate({ color: v })} ph="#1a1a1a" /></F><F label="Imagen"><FU value={p.file as string || ''} onChange={(v) => onUpdate({ file: v })} accept="image/*" /></F><F label="Transicion"><SL value={p.transition as string} onChange={(v) => onUpdate({ transition: v })} opts={[{ v: 'none', l: 'Ninguna' }, { v: 'fade', l: 'Fade' }, { v: 'dissolve', l: 'Disolver' }]} /></F><F label="Duracion (ms)"><NI value={p.duration as number} onChange={(v) => onUpdate({ duration: v })} min={0} /></F></>)
    case 'dialog': return (<><F label="Personaje"><CS value={p.character as string} onChange={(v) => onUpdate({ character: v })} /></F><F label="Texto"><TA value={p.text as string} onChange={(v) => onUpdate({ text: v })} /></F><F label="Expresion"><TI value={p.expression as string} onChange={(v) => onUpdate({ expression: v })} ph="neutral" /></F><F label="Posicion"><SL value={p.position as string} onChange={(v) => onUpdate({ position: v })} opts={[{ v: 'left', l: 'Izquierda' }, { v: 'center', l: 'Centro' }, { v: 'right', l: 'Derecha' }]} /></F></>)
    case 'character': return (<><F label="Personaje"><CS value={p.character as string} onChange={(v) => onUpdate({ character: v })} /></F><F label="Accion"><SL value={p.action as string} onChange={(v) => onUpdate({ action: v })} opts={[{ v: 'show', l: 'Mostrar' }, { v: 'hide', l: 'Ocultar' }, { v: 'move', l: 'Mover' }]} /></F><F label="Expresion"><TI value={p.expression as string} onChange={(v) => onUpdate({ expression: v })} /></F><F label="Posicion"><SL value={p.position as string} onChange={(v) => onUpdate({ position: v })} opts={[{ v: 'left', l: 'Izquierda' }, { v: 'center', l: 'Centro' }, { v: 'right', l: 'Derecha' }]} /></F></>)
    case 'choice': { const opts = (p.options as { id: string; text: string }[]) || []; return (<div className="space-y-2">{opts.map((op, i) => (<div key={op.id} className="flex items-center gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600/40 text-[10px] font-bold text-amber-300">{i + 1}</span><TI value={op.text} onChange={(v) => onUpdate({ options: opts.map((o) => o.id === op.id ? { ...o, text: v } : o) })} /></div>))}<button onClick={() => onUpdate({ options: [...opts, { id: crypto.randomUUID(), text: `Opcion ${opts.length + 1}` }] })} className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-600 py-1.5 text-[11px] text-neutral-500 hover:border-amber-500 hover:text-amber-400"><Plus size={11} /> Agregar</button></div>) }
    case 'audio': return (<><F label="Audio"><FU value={p.file as string || ''} onChange={(v) => onUpdate({ file: v })} accept="audio/*" /></F><F label="Tipo"><SL value={p.audioType as string} onChange={(v) => onUpdate({ audioType: v })} opts={[{ v: 'music', l: 'Musica' }, { v: 'sfx', l: 'Efecto' }]} /></F><F label="Volumen"><NI value={p.volume as number} onChange={(v) => onUpdate({ volume: v })} min={0} max={1} /></F><CB value={p.loop as boolean} onChange={(v) => onUpdate({ loop: v })} label="Repetir" /></>)
    case 'condition': return (<><F label="Variable"><TI value={p.variable as string} onChange={(v) => onUpdate({ variable: v })} /></F><F label="Operador"><SL value={p.operator as string} onChange={(v) => onUpdate({ operator: v })} opts={[{ v: '==', l: 'Igual' }, { v: '!=', l: 'Distinto' }, { v: '>', l: 'Mayor' }, { v: '<', l: 'Menor' }]} /></F><F label="Valor"><TI value={p.value as string} onChange={(v) => onUpdate({ value: v })} /></F></>)
    case 'variable': return (<><F label="Nombre"><TI value={p.name as string} onChange={(v) => onUpdate({ name: v })} /></F><F label="Operacion"><SL value={p.operation as string} onChange={(v) => onUpdate({ operation: v })} opts={[{ v: 'assign', l: 'Asignar' }, { v: 'add', l: 'Sumar' }, { v: 'subtract', l: 'Restar' }]} /></F><F label="Valor"><TI value={p.value as string} onChange={(v) => onUpdate({ value: v })} /></F></>)
    case 'wait': return <F label="Duracion (ms)"><NI value={p.duration as number} onChange={(v) => onUpdate({ duration: v })} min={0} /></F>
    case 'transition': return (<><F label="Tipo"><SL value={p.type as string} onChange={(v) => onUpdate({ type: v })} opts={[{ v: 'fade', l: 'Fade' }, { v: 'dissolve', l: 'Disolver' }, { v: 'slide', l: 'Deslizar' }]} /></F><F label="Duracion (ms)"><NI value={p.duration as number} onChange={(v) => onUpdate({ duration: v })} min={0} /></F></>)
    case 'endScene': return <F label="Tipo"><SL value={p.type as string} onChange={(v) => onUpdate({ type: v })} opts={[{ v: 'endScene', l: 'Fin de Escena' }, { v: 'endGame', l: 'Fin del Juego' }]} /></F>
    default: return null
  }
}