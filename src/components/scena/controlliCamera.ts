/*
 * Controlli della camera
 * Tiene il riferimento all'istanza di CameraControls, registrata da
 * Scena quando il componente si monta.
 *
 * - Non sta nello store Redux: è un oggetto con metodi, non dati
 *   (Redux accetta solo valori serializzabili e lo segnalerebbe).
 * - Lo usano i thunk di azioniScena.ts per muovere e bloccare la
 *   camera, senza passare ref da un componente all'altro.
 */
import type { CameraControls } from "@react-three/drei"

let controlli: CameraControls | null = null

export function registraControlliCamera(istanza: CameraControls | null) {
  controlli = istanza
}

export function controlliCamera() {
  return controlli
}

/* Durante l'ispezione il trascinamento ruota il capo, non la camera */
export function bloccaCamera(bloccata: boolean) {
  if (controlli) controlli.enabled = !bloccata
}
