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
 */
import * as THREE from "three"
import type { CameraControls } from "@react-three/drei"
import {
  ESCURSIONE_ORIZZONTALE_GRADI,
  ESCURSIONE_VERTICALE_GRADI,
  type VistaCamera,
} from "../../config/camera"

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

export function vaiAllaVista(
  controlli: CameraControls | null,
  vista: VistaCamera,
  animata = true,
) {
  if (!controlli) return
  applicaLimiti(controlli, vista)
  void controlli.setLookAt(...vista.posizione, ...vista.obiettivo, animata)
}
