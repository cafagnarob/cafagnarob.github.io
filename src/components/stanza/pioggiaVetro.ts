/*
 * Pioggia sul vetro: preparazione
 * Analizza i piani del vetro e dell'immagine della città, ricava come
 * l'immagine è applicata (mappaturaUv) e assegna al vetro il materiale
 * con la pioggia. Restituisce il materiale (da animare) o null se
 * manca qualcosa; in quel caso il vetro resta con il materiale semplice.
 */
import * as THREE from "three"
import { analizzaPiano } from "../../utils/piano"
import { mappaturaUv } from "../../utils/mappaturaUv"
import { creaMaterialeVetroPioggia } from "../../materials/materialeVetroPioggia"
import { vistaPer } from "../scena/viste"
import { NOMI } from "./nomiStanza"

export function preparaPioggia(
  scena: THREE.Object3D,
  texturaCitta: THREE.Texture,
) {
  const vetro = scena.getObjectByName(NOMI.vetroFinestra)
  const citta = scena.getObjectByName(NOMI.citta)
  const vista = vistaPer("panoramica")
  if (
    !(vetro instanceof THREE.Mesh) ||
    !(citta instanceof THREE.Mesh) ||
    !vista
  ) {
    console.warn("Pioggia: vetro o immagine della città non trovati")
    return null
  }

  const puntoDiVista = new THREE.Vector3(...vista.posizione)
  const pianoCitta = analizzaPiano(citta, puntoDiVista)
  const pianoVetro = analizzaPiano(vetro, puntoDiVista)
  const materiale = creaMaterialeVetroPioggia(
    texturaCitta,
    pianoCitta,
    mappaturaUv(citta, pianoCitta),
    pianoVetro,
  )
  vetro.material = materiale
  return materiale
}
