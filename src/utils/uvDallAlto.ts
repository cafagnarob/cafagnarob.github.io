/*
 * UV proiettate dall'alto
 * Sostituisce le UV di una geometria con una proiezione dall'alto:
 *   u = posizione X, v = posizione Z, normalizzate sul lato più lungo
 * e centrate. Per un disco orizzontale: il centro dell'immagine va al
 * centro del disco e il cerchio dell'immagine sul bordo del disco.
 *
 * - Lato unico (quadrato) per X e Z: il cerchio non si deforma in ellisse.
 * - Vale se la rotazione dell'oggetto è applicata in Blender (il disco è
 *   orizzontale anche negli assi locali).
 * - Con flipY = false (texture glTF) l'immagine appare dritta vista
 *   dall'alto: il suo bordo superiore va verso -Z.
 */
import * as THREE from "three"

export function proiettaUvDallAlto(geometria: THREE.BufferGeometry) {
  geometria.computeBoundingBox()
  const { min, max } = geometria.boundingBox!
  const lato = Math.max(max.x - min.x, max.z - min.z)
  const centroX = (min.x + max.x) / 2
  const centroZ = (min.z + max.z) / 2

  const posizioni = geometria.getAttribute("position")
  const uv = new Float32Array(posizioni.count * 2)
  for (let i = 0; i < posizioni.count; i++) {
    uv[i * 2] = (posizioni.getX(i) - centroX) / lato + 0.5
    uv[i * 2 + 1] = (posizioni.getZ(i) - centroZ) / lato + 0.5
  }
  geometria.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
}
