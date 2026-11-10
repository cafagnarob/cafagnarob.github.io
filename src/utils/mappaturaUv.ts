/*
 * Mappatura UV di un piano
 * Trova la trasformazione che porta le coordinate del piano (s, t),
 * da 0 a 1 lungo destra e alto (vedi utils/piano.ts), alle UV con cui
 * l'immagine è applicata alla mesh:
 *   uv = M · (s, t, 1)
 * La calcola con i minimi quadrati su tutti i vertici: vale qualunque
 * sia l'orientamento delle UV (ruotate, capovolte, a specchio).
 * Serve allo shader della pioggia per leggere l'immagine della città
 * "da dietro il vetro".
 */
import * as THREE from "three"
import type { Piano } from "./piano"

export function mappaturaUv(m: THREE.Mesh, piano: Piano): THREE.Matrix3 {
  m.updateWorldMatrix(true, false)
  const posizioni = m.geometry.getAttribute("position")
  const uv = m.geometry.getAttribute("uv")

  // Sistema delle equazioni normali: (AᵀA) c = Aᵀb, con riga di A = (s, t, 1)
  const ata = new Array(9).fill(0)
  const atu = [0, 0, 0]
  const atv = [0, 0, 0]
  const p = new THREE.Vector3()

  for (let i = 0; i < posizioni.count; i++) {
    p.fromBufferAttribute(posizioni, i)
      .applyMatrix4(m.matrixWorld)
      .sub(piano.centro)
    const riga = [
      p.dot(piano.destra) / piano.larghezza + 0.5,
      p.dot(piano.alto) / piano.altezza + 0.5,
      1,
    ]
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) ata[r * 3 + c] += riga[r] * riga[c]
      atu[r] += riga[r] * uv.getX(i)
      atv[r] += riga[r] * uv.getY(i)
    }
  }

  const inversa = new THREE.Matrix3()
    .set(
      ...(ata as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]),
    )
    .invert()
  const cu = new THREE.Vector3(...atu).applyMatrix3(inversa)
  const cv = new THREE.Vector3(...atv).applyMatrix3(inversa)

  return new THREE.Matrix3().set(cu.x, cu.y, cu.z, cv.x, cv.y, cv.z, 0, 0, 1)
}
