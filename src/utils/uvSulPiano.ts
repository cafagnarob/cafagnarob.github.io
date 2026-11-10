/*
 * UV di un'immagine su un piano, con ritaglio "cover"
 * Ogni vertice riceve come UV la sua posizione sul rettangolo del piano
 * (0–1 da sinistra a destra e dal basso verso l'alto), poi la UV viene
 * ristretta attorno al centro perché l'immagine copra il piano SENZA
 * deformarsi, come object-fit: cover:
 *   piano più largo dell'immagine → si vede tutta la larghezza, si
 *                                   taglia sopra e sotto
 *   piano più stretto              → si vede tutta l'altezza, si
 *                                   taglia ai lati
 * Le posizioni si leggono nel mondo, come in analizzaPiano: vale anche
 * con rotazioni applicate. Con flipY = true (immagini normali) v = 1 è
 * il bordo alto dell'immagine.
 */
import * as THREE from "three"
import type { Piano } from "./piano"

export function uvSulPiano(
  m: THREE.Mesh,
  piano: Piano,
  aspettoImmagine: number,
) {
  m.updateWorldMatrix(true, false)
  const posizioni = m.geometry.getAttribute("position")
  const uv = new Float32Array(posizioni.count * 2)
  const p = new THREE.Vector3()

  const aspettoPiano = piano.larghezza / piano.altezza
  const scalaU =
    aspettoPiano < aspettoImmagine ? aspettoPiano / aspettoImmagine : 1
  const scalaV =
    aspettoPiano > aspettoImmagine ? aspettoImmagine / aspettoPiano : 1

  for (let i = 0; i < posizioni.count; i++) {
    p.fromBufferAttribute(posizioni, i)
      .applyMatrix4(m.matrixWorld)
      .sub(piano.centro)
    const s = p.dot(piano.destra) / piano.larghezza // -0.5 … +0.5
    const t = p.dot(piano.alto) / piano.altezza
    uv[i * 2] = 0.5 + s * scalaU
    uv[i * 2 + 1] = 0.5 + t * scalaV
  }
  m.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
}
