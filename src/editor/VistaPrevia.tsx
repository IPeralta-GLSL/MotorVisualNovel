import { useEffect, useState, useCallback } from 'react'
import { MotorNovelaVisual, type EstadoMotor } from '@/motor/MotorNovelaVisual'
import { useEditorStore } from '@/compartido/store/editorStore'
import { X } from 'lucide-react'

interface Props { onCerrar: () => void }

export default function VistaPrevia({ onCerrar }: Props) {
  const nodos = useEditorStore((s) => s.nodos)
  const aristas = useEditorStore((s) => s.aristas)
  const [motor] = useState(() => new MotorNovelaVisual(nodos, aristas))
  const [estado, setEstado] = useState<EstadoMotor>(motor.obtenerEstado())

  useEffect(() => {
    const desuscribir = motor.suscribir(setEstado)
    motor.iniciar()
    return () => { desuscribir(); motor.detener() }
  }, [motor])

  const handleClick = useCallback(() => { motor.avanzar() }, [motor])

  const handleSeleccionar = useCallback((id: string) => { motor.seleccionarOpcion(id) }, [motor])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onCerrar}>
      <div className="relative flex h-[600px] w-[900px] flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-neutral-900 px-4 py-2">
          <span className="text-sm font-bold text-neutral-300">Vista Previa</span>
          <button onClick={onCerrar} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"><X size={16} /></button>
        </div>

        <div className="relative flex-1 bg-neutral-950" onClick={handleClick}>
          <div className="absolute inset-0 flex items-center justify-center">
            {estado.fondoActual ? (
              <p className="text-lg text-neutral-600">[Fondo: {estado.fondoActual}]</p>
            ) : (
              <p className="text-sm text-neutral-700">Sin fondo</p>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-8 pb-2">
            {estado.personajesVisibles.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="flex h-32 w-20 items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800">
                  <span className="text-xs text-neutral-400">{p.expresion}</span>
                </div>
                <span className="mt-1 text-xs text-neutral-300">{p.id}</span>
              </div>
            ))}
          </div>

          {estado.textoDialogo && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6">
              <p className="mb-2 text-sm font-bold text-indigo-400">{estado.textoDialogo.personaje}</p>
              <p className="text-base leading-relaxed text-neutral-200">{estado.textoDialogo.texto}</p>
              <p className="mt-3 text-xs text-neutral-500">Click para continuar...</p>
            </div>
          )}

          {estado.opcionesEleccion && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="w-96 space-y-3 rounded-xl bg-neutral-900 p-6 border border-neutral-700">
                <p className="mb-4 text-center text-sm font-bold text-neutral-300">Elegí una opción</p>
                {estado.opcionesEleccion.map((op) => (
                  <button key={op.id} onClick={(e) => { e.stopPropagation(); handleSeleccionar(op.id) }}
                    className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-left text-sm text-neutral-200 transition-colors hover:border-indigo-500 hover:bg-neutral-700">
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!estado.enEjecucion && !estado.textoDialogo && !estado.opcionesEleccion && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg text-neutral-500">{estado.nodoActual ? 'Escena terminada' : 'No hay nodo de inicio'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}