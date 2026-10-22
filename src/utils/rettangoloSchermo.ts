/*
 * Rettangolo a schermo di oggetti 3D
 * Calcola il rettangolo (in pixel della pagina) che uno o più oggetti
 * occupano sullo schermo:
 *  1. ingombro 3D (bounding box) di tutti gli oggetti, nel mondo
 *  2. proiezione degli 8 angoli con la camera (project → coordinate
 *     da -1 a +1, "NDC")
 *  3. conversione in pixel rispetto alla posizione del canvas
 * È approssimato per eccesso (gli angoli della scatola possono uscire
 * un po' dalla sagoma del capo), ma per centrare e dimensionare il
 * render è più che sufficiente.
 */
import * as THREE from "three"

export type Rettangolo = {
  x: number
  y: number
  larghezza: number
  altezza: number
}

export function rettangoloSchermo(
  oggetti: THREE.Object3D[],
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
): Rettangolo {
  const scatola = new THREE.Box3()
  for (const oggetto of oggetti) scatola.expandByObject(oggetto)

  const area = canvas.getBoundingClientRect()
  const punto = new THREE.Vector3()
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity

  for (const x of [scatola.min.x, scatola.max.x]) {
    for (const y of [scatola.min.y, scatola.max.y]) {
      for (const z of [scatola.min.z, scatola.max.z]) {
        punto.set(x, y, z).project(camera)
        const px = area.left + ((punto.x + 1) / 2) * area.width
        const py = area.top + ((1 - punto.y) / 2) * area.height // in NDC la Y va verso l'alto
        minX = Math.min(minX, px)
        maxX = Math.max(maxX, px)
        minY = Math.min(minY, py)
        maxY = Math.max(maxY, py)
      }
    }
  }
  return { x: minX, y: minY, larghezza: maxX - minX, altezza: maxY - minY }
}
