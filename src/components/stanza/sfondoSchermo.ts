/*
 * Sfondo di uno schermo
 * Prepara una mesh schermo per mostrare la sua immagine:
 * 1. trova la faccia davanti, quella rivolta verso l'empty della vista
 *    (analizzaPiano), così l'immagine non risulta specchiata
 * 2. genera UV "cover" sul piano (uvSulPiano): l'immagine copre lo
 *    schermo senza deformarsi
 * 3. assegna il materiale con l'immagine (creaMaterialeSchermo)
 * Restituisce false se l'empty manca: chi chiama lascia il materiale
 * provvisorio.
 */
import * as THREE from "three"
import { analizzaPiano } from "../../utils/piano"
import { uvSulPiano } from "../../utils/uvSulPiano"
import { nomeGltf } from "../../utils/nomiGltf"
import { SFONDI_SCHERMI, type ChiaveSchermo } from "../../config/sfondiSchermi"
import { creaMaterialeSchermo } from "./materialiSpeciali"

export function applicaSfondoSchermo(
  schermo: THREE.Mesh,
  scena: THREE.Object3D,
  chiave: ChiaveSchermo,
  immagine: THREE.Texture,
): boolean {
  const { vuotoVista, aspetto } = SFONDI_SCHERMI[chiave]
  const vuoto = scena.getObjectByName(nomeGltf(vuotoVista))
  if (!vuoto) {
    console.warn(`Schermo ${chiave}: empty "${vuotoVista}" non trovato`)
    return false
  }

  const punto = vuoto.getWorldPosition(new THREE.Vector3())
  uvSulPiano(schermo, analizzaPiano(schermo, punto), aspetto)
  schermo.material = creaMaterialeSchermo(immagine)
  return true
}
