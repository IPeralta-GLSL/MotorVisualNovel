import NodoInicioEscena from './NodoInicioEscena'
import NodoDialogo from './NodoDialogo'
import NodoEleccion from './NodoEleccion'
import NodoReproducirAudio from './NodoReproducirAudio'
import NodoFondoEscenario from './NodoFondoEscenario'
import NodoMostrarPersonaje from './NodoMostrarPersonaje'
import NodoCondicion from './NodoCondicion'
import NodoAsignarVariable from './NodoAsignarVariable'
import NodoEspera from './NodoEspera'
import NodoTransicion from './NodoTransicion'
import NodoFin from './NodoFin'
import type { TipoNodo } from '@/compartido/tipos'
import type { ComponentType } from 'react'
import type { NodeProps } from '@xyflow/react'

export const tiposNodos: Record<TipoNodo, ComponentType<NodeProps>> = {
  inicioEscena: NodoInicioEscena,
  dialogo: NodoDialogo,
  eleccion: NodoEleccion,
  reproducirAudio: NodoReproducirAudio,
  fondoEscenario: NodoFondoEscenario,
  mostrarPersonaje: NodoMostrarPersonaje,
  condicion: NodoCondicion,
  asignarVariable: NodoAsignarVariable,
  espera: NodoEspera,
  transicion: NodoTransicion,
  fin: NodoFin,
}

export {
  NodoInicioEscena,
  NodoDialogo,
  NodoEleccion,
  NodoReproducirAudio,
  NodoFondoEscenario,
  NodoMostrarPersonaje,
  NodoCondicion,
  NodoAsignarVariable,
  NodoEspera,
  NodoTransicion,
  NodoFin,
}