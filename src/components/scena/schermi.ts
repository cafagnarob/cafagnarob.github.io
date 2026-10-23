/*
 * Schermi della stanza
 * - registraSchermi: salva le mesh degli schermi interattivi (chiamata
 *   da Stanza quando il modello è caricato), come registraVisteDaScena.
 * - schermoDi: nome glTF → schermo interattivo (o undefined).
 * - posaPerSchermo: dove mettere la camera perché lo schermo riempia la
 *   finestra del browser (vedi il calcolo spiegato sotto).
 *
 * Il calcolo usa la geometria in coordinate del MONDO, quindi funziona
 * anche se in Blender le rotazioni sono state applicate alla mesh.
 */
import * as THREE from "three"
import { SCHERMI, type NomeSchermo } from "../../config/schermi"
import type { VistaCamera } from "../../config/camera"
import { nomeGltf } from "../../utils/nomiGltf"

type Punto = VistaCamera["posizione"]

const mesh = new Map<NomeSchermo, THREE.Mesh>()

const NOME_GLTF_A_SCHERMO = new Map(
  (Object.entries(SCHERMI) as [NomeSchermo, { nome: string }][]).map(
    ([schermo, { nome }]) => [nomeGltf(nome), schermo],
  ),
)

export function registraSchermi(scena: THREE.Object3D) {
  scena.traverse((oggetto) => {
    const schermo = NOME_GLTF_A_SCHERMO.get(oggetto.name)
    if (schermo && oggetto instanceof THREE.Mesh) mesh.set(schermo, oggetto)
  })
}

export const schermoDi = (nomeGltfOggetto: string) =>
  NOME_GLTF_A_SCHERMO.get(nomeGltfOggetto)
export const meshSchermo = (schermo: NomeSchermo) => mesh.get(schermo)

/* Vertici e normali della mesh in coordinate del mondo */
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

/* Lato lungo di un insieme di punti su un piano (u, v): analisi delle
   componenti principali (PCA) in 2D. Per un rettangolo è il lato lungo. */
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

export function posaPerSchermo(
  schermo: NomeSchermo,
  m: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
): VistaCamera {
  const { vertici, direzioni } = geometriaNelMondo(m)

  // 1. Centro
  const centro = new THREE.Vector3()
  for (const p of vertici) centro.add(p)
  centro.divideScalar(vertici.length)
  const versoCamera = camera.position.clone().sub(centro).normalize()

  // 2. Normale: media delle normali rivolte verso la camera
  const normale = new THREE.Vector3()
  for (const n of direzioni) if (n.dot(versoCamera) > 0) normale.add(n)
  if (normale.lengthSq() < 1e-6) normale.copy(versoCamera) // mesh senza normali utili
  normale.normalize()

  // 3. "Alto" dello schermo
  const suMondo = new THREE.Vector3(0, 1, 0)
  let alto: THREE.Vector3
  if (Math.abs(normale.dot(suMondo)) < 0.7) {
    // In piedi (monitor): verticale del mondo proiettata sul piano
    alto = suMondo
      .clone()
      .addScaledVector(normale, -normale.dot(suMondo))
      .normalize()
  } else {
    // Sdraiato (telefono): lato lungo, lontano dalla camera
    const u = new THREE.Vector3(1, 0, 0)
      .addScaledVector(normale, -normale.x)
      .normalize()
    const v = normale.clone().cross(u)
    alto = latoLungo(vertici, centro, u, v)
    if (alto.dot(versoCamera) > 0) alto.negate()
  }
  if (SCHERMI[schermo].capovolgi) alto.negate()
  const destra = alto.clone().cross(normale)

  // 4. Dimensioni: proiezione dei vertici su "alto" e "destra"
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
  const altezza = maxA - minA
  const larghezza = maxD - minD

  // Centro del RETTANGOLO (a metà tra i bordi), non media dei vertici:
  // la media si sposta se i vertici non sono distribuiti in modo uniforme
  centro
    .addScaledVector(alto, (minA + maxA) / 2)
    .addScaledVector(destra, (minD + maxD) / 2)

  // Distanza "cover": lo schermo copre tutta la finestra
  const tangente = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const distanza = Math.min(altezza, larghezza / camera.aspect) / (2 * tangente)

  // Lo spostamento minuscolo verso il basso orienta la camera anche
  // quando guarda dritta in giù (telefono): senza, "l'alto" sarebbe casuale
  const posizione = centro
    .clone()
    .addScaledVector(normale, distanza)
    .addScaledVector(alto, -distanza * 0.001)

  return {
    posizione: posizione.toArray() as Punto,
    obiettivo: centro.toArray() as Punto,
  }
}
