/*
 * Sfarfallio del neon
 *
 * Calcola l'intensità del neon (0 = spento, 1 = pieno) in funzione
 * del tempo in secondi. Imita un neon reale:
 *  - ronzio: oscillazione leggera e veloce, sempre presente (±4%)
 *  - sfarfallio: ogni CICLO secondi, per una breve FINESTRA,
 *    il neon si abbassa a scatti in modo irregolare
 * È una funzione pura: stesso tempo → stessa intensità.
 */
const CICLO = 5 // ogni quanti secondi arriva uno sfarfallio
const FINESTRA = 0.45 // quanto dura la serie di sfarfallii (secondi)

export function intensitaNeon(tempo: number): number {
  // Ronzio continuo: due onde a frequenze diverse si sommano
  const ronzio =
    0.96 + 0.02 * Math.sin(tempo * 47) + 0.02 * Math.sin(tempo * 113)

  // Posizione all'interno del ciclo corrente (da 0 a CICLO)
  const momento = tempo % CICLO

  // Fuori dalla finestra: neon acceso con il solo ronzio
  if (momento < CICLO - FINESTRA) return ronzio

  // Dentro la finestra: scatti irregolari tra quasi spento e acceso.
  // Il prodotto di due onde a frequenze "strane" dà un ritmo non ripetitivo.
  const scatto = Math.sin(momento * 61) * Math.sin(momento * 23)
  return scatto > 0 ? ronzio * 0.25 : ronzio
}
