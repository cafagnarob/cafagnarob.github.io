/*
 * Sfocatura (profondità di campo) nella vista del PC
 * - VISTA_SFOCATA: la vista in cui il resto della stanza si sfoca.
 * - SCHERMO_A_FUOCO: lo schermo messo a fuoco (il suo centro).
 * - SCALA_BOKEH: intensità della sfocatura (0 = nitido).
 * - PROFONDITA_A_FUOCO_M: quanti metri attorno allo schermo restano
 *   nitidi. Piccolo = solo il monitor; grande = anche la scrivania.
 * - VELOCITA_SFOCATURA: quanto in fretta la sfocatura entra ed esce.
 */
import type { NomeVista } from "./camera"
import type { NomeSchermo } from "./schermi"

export const VISTA_SFOCATA: NomeVista = "pc"
export const SCHERMO_A_FUOCO: NomeSchermo = "pc"
export const SCALA_BOKEH = 3
export const PROFONDITA_A_FUOCO_M = 0.1
export const VELOCITA_SFOCATURA = 3
