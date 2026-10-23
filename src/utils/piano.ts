/*
 * Analisi di una superficie piana (schermo, immagine della città…)
 * Dalla geometria in coordinate del MONDO ricava:
 *   centro (del rettangolo), normale (verso chi guarda), alto, destra,
 *   larghezza e altezza.
 * Funziona anche se in Blender le rotazioni sono state applicate alla mesh.
 *
 * - Normale: media delle normali dei vertici rivolte verso il punto di
 *   vista (se la superficie ha spessore, il retro viene ignorato).
 * - Alto: per una superficie in piedi è la verticale del mondo
 *   proiettata sul piano; per una sdraiata (telefono) è il lato lungo
 *   (analisi delle componenti principali, PCA), lontano dal punto di vista.
 * - Centro: a metà tra i bordi, non media dei vertici (che si sposta
 *   se i vertici non sono distribuiti in modo uniforme).
 */
import * as THREE from "three"

export type Piano = {
  centro: THREE.Vector3
  normale: THREE.Vector3
  alto: THREE.Vector3
  destra: THREE.Vector3
  larghezza: number
  altezza: number
}

function geometriaNelMondo(m: THREE.Mesh) {
  m.updateWorldMatrix(true, false)
  const posizioni = m.geometry.getAttribute("position")
  const normali = m.geometry.getAttribute("normal")
  const matriceNormali = new THREE.Matrix3().getNormalMatrix(m.matrixWorld)
  const vertici: THREE.Vector3[] = []
  const direzioni: THREE.Vector3[] = []
  for (let i = 0; i < posizioni.count; i++) {
    vertici.push(
      new THREE.Vector3()
        .fromBufferAttribute(posizioni, i)
        .applyMatrix4(m.matrixWorld),
    )
    if (normali) {
      direzioni.push(
        new THREE.Vector3()
          .fromBufferAttribute(normali, i)
          .applyMatrix3(matriceNormali)
          .normalize(),
      )
    }
  }
  return { vertici, direzioni }
}

/* Lato lungo di un insieme di punti sul piano (u, v): PCA in 2D */
function latoLungo(
  punti: THREE.Vector3[],
  centro: THREE.Vector3,
  u: THREE.Vector3,
  v: THREE.Vector3,
) {
  let uu = 0,
    vv = 0,
    uv = 0
  for (const p of punti) {
    const d = p.clone().sub(centro)
    const a = d.dot(u),
      b = d.dot(v)
    uu += a * a
    vv += b * b
    uv += a * b
  }
  const angolo = 0.5 * Math.atan2(2 * uv, uu - vv)
  return u
    .clone()
    .multiplyScalar(Math.cos(angolo))
    .addScaledVector(v, Math.sin(angolo))
}

export function analizzaPiano(
  m: THREE.Mesh,
  puntoDiVista: THREE.Vector3,
): Piano {
  const { vertici, direzioni } = geometriaNelMondo(m)

  // Centro provvisorio (media dei vertici): riferimento per misurare i bordi
  const centro = new THREE.Vector3()
  for (const p of vertici) centro.add(p)
  centro.divideScalar(vertici.length)
  const versoVista = puntoDiVista.clone().sub(centro).normalize()

  // Normale
  const normale = new THREE.Vector3()
  for (const n of direzioni) if (n.dot(versoVista) > 0) normale.add(n)
  if (normale.lengthSq() < 1e-6) normale.copy(versoVista)
  normale.normalize()

  // Alto
  const suMondo = new THREE.Vector3(0, 1, 0)
  let alto: THREE.Vector3
  if (Math.abs(normale.dot(suMondo)) < 0.7) {
    alto = suMondo
      .clone()
      .addScaledVector(normale, -normale.dot(suMondo))
      .normalize()
  } else {
    const u = new THREE.Vector3(1, 0, 0)
      .addScaledVector(normale, -normale.x)
      .normalize()
    const v = normale.clone().cross(u)
    alto = latoLungo(vertici, centro, u, v)
    if (alto.dot(versoVista) > 0) alto.negate()
  }
  const destra = alto.clone().cross(normale)

  // Bordi, dimensioni e centro del rettangolo
  let minA = Infinity,
    maxA = -Infinity,
    minD = Infinity,
    maxD = -Infinity
  for (const p of vertici) {
    const d = p.clone().sub(centro)
    minA = Math.min(minA, d.dot(alto))
    maxA = Math.max(maxA, d.dot(alto))
    minD = Math.min(minD, d.dot(destra))
    maxD = Math.max(maxD, d.dot(destra))
  }
  centro
    .addScaledVector(alto, (minA + maxA) / 2)
    .addScaledVector(destra, (minD + maxD) / 2)

  return {
    centro,
    normale,
    alto,
    destra,
    larghezza: maxD - minD,
    altezza: maxA - minA,
  }
}
