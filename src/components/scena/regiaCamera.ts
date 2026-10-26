/*
 * Regia della camera
 * Funzioni per spostare la camera tra le viste definite in
 * config/camera.ts.
 *
 * vaiAllaVista:
 *   1. calcola gli angoli della vista (coordinate sferiche: azimut
 *      orizzontale, polare verticale, raggio = distanza)
 *   2. imposta i limiti di rotazione attorno a quegli angoli
 *      (± ESCURSIONE) e blocca la distanza (niente zoom)
 *   3. sposta la camera sulla vista, con o senza animazione
 * I limiti vengono impostati PRIMA dello spostamento, così la
 * destinazione è sempre dentro l'area consentita.
 *
 * liberaLimiti: toglie i limiti (zoom negli schermi).
 * impostaSpazioModale: sposta l'inquadratura per lasciare libera la
 * parte di schermo non coperta dal modale del profilo.
 */
import type CameraControls from "camera-controls"
import * as THREE from "three"
import {
  ESCURSIONE_ORIZZONTALE_GRADI,
  ESCURSIONE_VERTICALE_GRADI,
  type VistaCamera,
} from "../../config/camera"
import {
  ALTEZZA_FOGLIO,
  LARGHEZZA_MODALE_PX,
  LARGHEZZA_MODALE_VW,
  MARGINE_DESTRO,
  MEDIA_LATERALE,
  POSIZIONE_FOTO,
  VERSO_SPOSTAMENTO,
} from "../../config/profilo"

/* Oggetti riutilizzati: evitano di crearne di nuovi a ogni chiamata */
const sferica = new THREE.Spherical()
const posizione = new THREE.Vector3()
const obiettivo = new THREE.Vector3()

function applicaLimiti(controlli: CameraControls, vista: VistaCamera) {
  // Vettore che va dal punto guardato alla camera
  posizione.fromArray(vista.posizione)
  obiettivo.fromArray(vista.obiettivo)
  sferica.setFromVector3(posizione.sub(obiettivo))

  const orizzontale = THREE.MathUtils.degToRad(ESCURSIONE_ORIZZONTALE_GRADI)
  const verticale = THREE.MathUtils.degToRad(ESCURSIONE_VERTICALE_GRADI)

  controlli.minAzimuthAngle = sferica.theta - orizzontale
  controlli.maxAzimuthAngle = sferica.theta + orizzontale
  controlli.minPolarAngle = sferica.phi - verticale
  controlli.maxPolarAngle = sferica.phi + verticale

  // Distanza fissa = nessuno zoom possibile
  controlli.minDistance = sferica.radius
  controlli.maxDistance = sferica.radius
}

/* Restituisce una Promise che si risolve a camera ferma */
export function vaiAllaVista(
  controlli: CameraControls | null,
  vista: VistaCamera,
  animata = true,
): Promise<void> {
  if (!controlli) return Promise.resolve()
  applicaLimiti(controlli, vista)
  return controlli.setLookAt(...vista.posizione, ...vista.obiettivo, animata)
}

/* Toglie limiti di angolo e distanza (zoom nello schermo):
   vaiAllaVista li reimposta quando si torna a una vista */
export function liberaLimiti(controlli: CameraControls) {
  controlli.minAzimuthAngle = -Infinity
  controlli.maxAzimuthAngle = Infinity
  controlli.minPolarAngle = 0
  controlli.maxPolarAngle = Math.PI
  controlli.minDistance = 0
  controlli.maxDistance = Infinity
}

/* Frazione della larghezza dello schermo occupata dal modale a destra
   (finestra + margine destro), con le stesse regole del CSS */
function frazioneModale() {
  const larghezza = window.innerWidth
  const finestra = Math.min(
    LARGHEZZA_MODALE_PX,
    LARGHEZZA_MODALE_VW * larghezza,
  )
  const margine = THREE.MathUtils.clamp(
    MARGINE_DESTRO.vw * larghezza,
    MARGINE_DESTRO.minimo,
    MARGINE_DESTRO.massimo,
  )
  return (finestra + margine) / larghezza
}

/* Camera di prova, riutilizzata: serve solo a proiettare un punto */
const cameraProva = new THREE.PerspectiveCamera()
const proiettato = new THREE.Vector3()
const inCamera = new THREE.Vector3()

/*
 * Spazio per il modale del profilo
 * Porta il "punto" (la foto) in una posizione precisa dello schermo,
 * nella parte libera dal modale, spostando l'inquadratura con
 * setFocalOffset (camera e punto guardato insieme, angolo invariato):
 *   1. una camera di prova, nella posizione finale della vista, proietta
 *      il punto: posizione sullo schermo da -1 a +1 (NDC)
 *   2. si sceglie la posizione voluta (POSIZIONE_FOTO nello spazio libero)
 *   3. la differenza, moltiplicata per la mezza larghezza / altezza
 *      inquadrata alla distanza del punto, è lo spostamento in metri.
 *      Spostare la camera a destra fa andare il punto a sinistra.
 * Con attivo = false (o senza punto) toglie lo spostamento.
 */
export function impostaSpazioModale(
  controlli: CameraControls | null,
  attivo: boolean,
  vista: VistaCamera,
  punto: THREE.Vector3 | null,
  animata = true,
): Promise<void> {
  if (!controlli) return Promise.resolve()
  if (
    !attivo ||
    !punto ||
    !(controlli.camera instanceof THREE.PerspectiveCamera)
  ) {
    return controlli.setFocalOffset(0, 0, 0, animata)
  }

  // 1. Dove finirebbe il punto con la vista finale, senza spostamento
  cameraProva.copy(controlli.camera, false) // solo le impostazioni, non i figli
  cameraProva.position.fromArray(vista.posizione)
  cameraProva.lookAt(...vista.obiettivo)
  cameraProva.updateMatrixWorld()
  proiettato.copy(punto).project(cameraProva)
  inCamera.copy(punto).applyMatrix4(cameraProva.matrixWorldInverse)
  const profondita = -inCamera.z

  // 2. Dove lo vogliamo (in NDC: -1 sinistra/basso, +1 destra/alto)
  let voluto: { x: number; y: number }
  if (window.matchMedia(MEDIA_LATERALE).matches) {
    const libero = 1 - frazioneModale() // frazione di larghezza libera a sinistra
    voluto = { x: -1 + 2 * libero * POSIZIONE_FOTO.laterale, y: 0 }
  } else {
    const libero = 1 - ALTEZZA_FOGLIO // frazione di altezza libera in alto
    voluto = { x: 0, y: 1 - 2 * libero * POSIZIONE_FOTO.foglio }
  }

  // 3. Spostamento in metri alla distanza del punto
  const mezzaAltezza =
    profondita * Math.tan(THREE.MathUtils.degToRad(cameraProva.fov / 2))
  const mezzaLarghezza = mezzaAltezza * cameraProva.aspect
  return controlli.setFocalOffset(
    VERSO_SPOSTAMENTO.x * (proiettato.x - voluto.x) * mezzaLarghezza,
    VERSO_SPOSTAMENTO.y * (proiettato.y - voluto.y) * mezzaAltezza,
    0,
    animata,
  )
}
