/*
 * Fuori dalla finestra: auto e luce lampeggiante
 * Posizioni in FRAZIONI dell'immagine della città:
 *   x: 0 = bordo sinistro, 1 = destro;  y: 0 = basso, 1 = alto.
 * Dimensioni in frazioni dell'altezza dell'immagine.
 * Colori in luce lineare: valori sopra 1 = luci intense (la tonemapping
 * AgX li porta a schermo come fa con il neon).
 *
 * - CORSIE: altezza della strada e direzione (+1 verso destra con i
 *   fari, -1 verso sinistra con gli stop).
 * - SCOSTAMENTO_M: distanza davanti all'immagine (metri), perché le
 *   luci non si "mescolino" con la sua superficie.
 */
type Colore = [number, number, number]

export const SCOSTAMENTO_M = 0.02

export const COLORE_FARI: Colore = [2.4, 2.0, 1.4]
export const COLORE_STOP: Colore = [2.0, 0.18, 0.1]

export const CORSIE = [
  { y: 0.14, direzione: 1, colore: COLORE_FARI },
  { y: 0.18, direzione: -1, colore: COLORE_STOP },
] as const

export const AUTO_PER_CORSIA = 4
export const VELOCITA_AUTO = { minima: 0.04, massima: 0.09 } // frazioni di larghezza al secondo
export const DISTANZA_LUCI_AUTO = 0.014 // tra le due luci della stessa auto
export const DIAMETRO_LUCE_AUTO = 0.028
export const SFUMATURA_BORDI = 0.08 // le auto entrano ed escono sfumando

export const LAMPEGGIANTE = {
  x: 0.72,
  y: 0.86,
  diametro: 0.03,
  colore: [3.0, 0.2, 0.1] as Colore,
  periodo: 1.6, // secondi tra un lampo e l'altro
  durata: 0.35, // durata del lampo
}
