/*
 * Respiro dell'alone
 * Funzioni pure: nessuno stato, nessun React. Si chiamano in useFrame
 * a ogni fotogramma e costano pochissimo.
 *
 * Forma del respiro: sin² su mezzo periodo, una "collina" morbida che
 * parte da 0, arriva a 1 a metà e torna a 0 senza scatti.
 */
import { INVITO } from "../config/invito"

/* Posizione di un oggetto nella sequenza dell'invito. Se non è in
   ORDINE, va in coda usando la sua posizione di ripiego. */
export function indiceInvito(nome: string, ripiego = 0): number {
  const i = INVITO.ORDINE.indexOf(nome)
  return i >= 0 ? i : INVITO.ORDINE.length + ripiego
}

/* Intensità 0–INTENSITA del respiro.
   tempo: secondi da quando l'invito è (ri)partito; indice: posizione
   dell'oggetto nella sequenza */
export function intensitaRespiro(tempo: number, indice: number): number {
  const { PERIODO_S, DURATA_S, SFASAMENTO_S, RITARDO_S, INTENSITA } = INVITO
  const locale = tempo - RITARDO_S - indice * SFASAMENTO_S
  if (locale < 0) return 0 // il suo turno non è ancora arrivato
  const t = locale % PERIODO_S
  if (t > DURATA_S) return 0 // pausa tra un respiro e l'altro
  const s = Math.sin((t / DURATA_S) * Math.PI)
  return s * s * INTENSITA
}
