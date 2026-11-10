/*
 * Utilità per i turntable
 * - urlFotogrammi: costruisce l'elenco degli URL dei fotogrammi
 *   (00.webp, 01.webp…) a partire da cartella e numero.
 * - precaricaTurntable: avvia il download di tutti i fotogrammi senza
 *   mostrarli. Il browser li mette in cache: quando il visore li
 *   chiede sono già pronti, e il cambio di fotogramma è istantaneo.
 */
import type { Turntable } from "../data/lavoriModa"

export function urlFotogrammi({ cartella, fotogrammi }: Turntable): string[] {
  return Array.from(
    { length: fotogrammi },
    (_, indice) => `${cartella}/${String(indice).padStart(2, "0")}.webp`,
  )
}

export function precaricaTurntable(turntable: Turntable) {
  for (const url of urlFotogrammi(turntable)) {
    const immagine = new Image()
    immagine.decoding = "async"
    immagine.src = url
  }
}

/* URL della versione HD di un fotogramma (cartella gemella "_hd").
   Si carica solo quando serve: con lo zoom oltre SOGLIA_HD. */
export function urlFotogrammaHd(
  { cartella }: Turntable,
  indice: number,
): string {
  return `${cartella}_hd/${String(indice).padStart(2, "0")}.webp`
}
