import type { Node, Edge } from '@xyflow/react'

export type TipoNodo =
  | 'inicioEscena'
  | 'dialogo'
  | 'eleccion'
  | 'reproducirAudio'
  | 'fondoEscenario'
  | 'mostrarPersonaje'
  | 'condicion'
  | 'asignarVariable'
  | 'espera'
  | 'transicion'
  | 'fin'

export interface DatosBaseNodo {
  etiqueta: string
  [key: string]: unknown
}

export interface DatosInicioEscena extends DatosBaseNodo {
  nombreEscena: string
}

export interface DatosDialogo extends DatosBaseNodo {
  personaje: string
  texto: string
  expresion: string
  posicionPersonaje: 'izquierda' | 'centro' | 'derecha'
}

export interface DatosEleccion extends DatosBaseNodo {
  opciones: OpcionEleccion[]
}

export interface OpcionEleccion {
  id: string
  texto: string
  condicion?: string
}

export interface DatosReproducirAudio extends DatosBaseNodo {
  tipoAudio: 'musica' | 'efecto'
  archivo: string
  volumen: number
  loop: boolean
}

export interface DatosFondoEscenario extends DatosBaseNodo {
  archivo: string
  transicion: 'ninguna' | 'fade' | 'dissolve' | 'cut'
  duracion: number
}

export interface DatosMostrarPersonaje extends DatosBaseNodo {
  personaje: string
  expresion: string
  posicion: 'izquierda' | 'centro' | 'derecha'
  accion: 'mostrar' | 'ocultar' | 'mover'
}

export interface DatosCondicion extends DatosBaseNodo {
  variable: string
  operador: '==' | '!=' | '>' | '<' | '>=' | '<='
  valor: string
}

export interface DatosAsignarVariable extends DatosBaseNodo {
  nombreVariable: string
  operacion: 'asignar' | 'sumar' | 'restar'
  valor: string
}

export interface DatosEspera extends DatosBaseNodo {
  duracion: number
}

export interface DatosTransicion extends DatosBaseNodo {
  tipoTransicion: 'fade' | 'dissolve' | 'cut' | 'slide'
  duracion: number
  direccion?: 'arriba' | 'abajo' | 'izquierda' | 'derecha'
}

export interface DatosFin extends DatosBaseNodo {
  tipoFin: 'finEscena' | 'finJuego'
}

export type DatosNodo =
  | DatosInicioEscena
  | DatosDialogo
  | DatosEleccion
  | DatosReproducirAudio
  | DatosFondoEscenario
  | DatosMostrarPersonaje
  | DatosCondicion
  | DatosAsignarVariable
  | DatosEspera
  | DatosTransicion
  | DatosFin

export type NodoVisualNovel = Node<DatosNodo, TipoNodo>
export type AristaVisualNovel = Edge

export interface VariableJuego {
  nombre: string
  tipo: 'numero' | 'texto' | 'booleano'
  valorInicial: string
}

export interface Personaje {
  id: string
  nombre: string
  color: string
  expresiones: string[]
}