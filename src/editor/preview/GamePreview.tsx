import { useEffect, useState, useCallback, useRef } from 'react'
import { VNEngine, type VNState } from '@/engine/VNEngine'
import { useEditorStore } from '@/shared/store/editorStore'
import { X } from 'lucide-react'

interface Props { onClose: () => void }

export default function GamePreview({ onClose }: Props) {
  const liteGraph = useEditorStore((s) => s.liteGraph)
  const [engine] = useState(() => liteGraph ? new VNEngine(liteGraph) : null)
  const [state, setState] = useState<VNState>({ currentSceneId: null, variables: {}, visibleCharacters: [], background: '', dialogText: null, choiceOptions: null, waitingForInput: false, running: false })
  const [visibleText, setVisibleText] = useState('')
  const [typing, setTyping] = useState(false)
  const [entering, setEntering] = useState(true)
  const typingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setTimeout(() => setEntering(false), 50)
    if (!engine) return
    const unsub = engine.subscribe((s) => { setState(s); if (s.dialogText && s.dialogText.text !== state.dialogText?.text) startTyping(s.dialogText.text) })
    engine.start()
    return () => { unsub(); engine.stop(); if (timerRef.current) clearTimeout(timerRef.current) }
  }, [engine])

  const startTyping = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    typingRef.current = true; setTyping(true); setVisibleText('')
    let i = 0
    const tick = () => { if (i < text.length && typingRef.current) { setVisibleText(text.slice(0, i + 1)); i++; timerRef.current = setTimeout(tick, 25) } else { typingRef.current = false; setTyping(false); setVisibleText(text) } }
    tick()
  }, [])

  const handleClick = useCallback(() => {
    if (typingRef.current) { typingRef.current = false; if (timerRef.current) clearTimeout(timerRef.current); setVisibleText(state.dialogText?.text || ''); setTyping(false) }
    else if (engine) engine.advance()
  }, [engine, state.dialogText])

  const handleChoice = useCallback((id: string) => { if (engine) engine.selectChoice(id) }, [engine])

  const posMap: Record<string, string> = { left: 'left-[15%]', center: 'left-1/2 -translate-x-1/2', right: 'right-[15%]' }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-all duration-300 ${entering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="relative flex h-[600px] w-[960px] flex-col overflow-hidden rounded-2xl border border-neutral-700 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between bg-neutral-900/90 px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Vista Previa</span>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800"><X size={14} /></button>
        </div>
        <div className="relative flex-1 cursor-pointer select-none bg-neutral-950" onClick={handleClick}>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-950" />
          {state.visibleCharacters.map((ch) => (
            <div key={ch.id} className={`absolute bottom-[140px] ${posMap[ch.position] || 'left-1/2 -translate-x-1/2'} flex flex-col items-center transition-all duration-500`}>
              <div className="flex h-40 w-24 items-center justify-center rounded-xl border-2 border-neutral-600/50 bg-gradient-to-b from-neutral-700 to-neutral-800"><span className="text-xs text-neutral-400">{ch.expression}</span></div>
              <span className="mt-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-neutral-300">{ch.id}</span>
            </div>
          ))}
          {state.dialogText && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="mx-4 mb-4 rounded-xl border border-neutral-700/50 bg-black/90 px-8 py-5 backdrop-blur-md">
                <p className="mb-2 text-sm font-bold tracking-wide text-indigo-400">{state.dialogText.character}</p>
                <p className="min-h-[48px] text-base leading-relaxed text-neutral-100">{visibleText}{typing && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-400" />}</p>
                {!typing && <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-600">Click para continuar</p>}
              </div>
            </div>
          )}
          {state.choiceOptions && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="w-[420px] space-y-2 rounded-xl border border-neutral-700 bg-neutral-900/95 p-5">
                <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-neutral-400">Elegi una opcion</p>
                {state.choiceOptions.map((op, i) => (
                  <button key={op.id} onClick={(e) => { e.stopPropagation(); handleChoice(op.id) }}
                    className="flex w-full items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-left hover:border-indigo-500 hover:bg-neutral-700 transition-colors">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-xs font-bold text-indigo-300">{i + 1}</span>
                    <span className="text-sm text-neutral-200">{op.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {!state.running && !state.dialogText && !state.choiceOptions && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <p className="text-lg text-neutral-500">{state.currentSceneId ? 'Escena terminada' : 'Sin escenas en el grafo'}</p>
              <button onClick={(e) => { e.stopPropagation(); if (engine) { engine.stop(); engine.start() } }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Reiniciar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}