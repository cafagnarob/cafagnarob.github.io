/*
 * Adattamento delle viste allo schermo
 * Su uno schermo più stretto del riferimento 16:9:
 *   1. la camera arretra lungo la stessa direzione (fattore), così il
 *      soggetto non viene tagliato ai lati;
 *   2. camera e punto guardato scorrono insieme lungo gli assi destra /
 *      alto della camera (spostamento): ricentra l'inquadratura senza
 *      cambiare la prospettiva. Cresce gradualmente fino al formato telefono.
 * Su schermi uguali o più larghi la vista non cambia.
 *
 * - Si arretra invece di allargare il campo visivo: un campo più ampio
 *   deformerebbe la prospettiva ai bordi (effetto grandangolo).
 * - aspetto = proporzioni della finestra: il Canvas la occupa tutta.
 */
import * as THREE from "three"
import {
  ADATTAMENTO_PER_VISTA,
  ADATTAMENTO_STRETTO,
  ASPETTO_RIFERIMENTO,
  ASPETTO_TELEFONO,
  type NomeVista,
  type VistaCamera,
} from "../../config/camera"

type Punto = VistaCamera["posizione"]

export const aspettoFinestra = () => window.innerWidth / window.innerHeight

const SU = new THREE.Vector3(0, 1, 0)

export function adattaAlloSchermo(
  vista: VistaCamera,
  nome: NomeVista,
): VistaCamera {
  const aspetto = aspettoFinestra()
  if (aspetto >= ASPETTO_RIFERIMENTO) return vista

  const { esponente, massimo, spostamento } = {
    ...ADATTAMENTO_STRETTO,
    ...ADATTAMENTO_PER_VISTA[nome],
  }

  const posizione = new THREE.Vector3(...vista.posizione)
  const obiettivo = new THREE.Vector3(...vista.obiettivo)

  // 1. Arretramento lungo la direzione della vista
  const fattore = Math.min(
    massimo,
    (ASPETTO_RIFERIMENTO / aspetto) ** esponente,
  )
  posizione.sub(obiettivo).multiplyScalar(fattore).add(obiettivo)

  // 2. Spostamento dell'inquadratura, graduale: 0 a 16:9, pieno al formato telefono
  const quanto = THREE.MathUtils.clamp(
    (ASPETTO_RIFERIMENTO - aspetto) / (ASPETTO_RIFERIMENTO - ASPETTO_TELEFONO),
    0,
    1,
  )
  const direzione = obiettivo.clone().sub(posizione).normalize()
  const destra = direzione.clone().cross(SU).normalize()
  const alto = destra.clone().cross(direzione)
  const scorrimento = destra
    .multiplyScalar(spostamento.destra * quanto)
    .addScaledVector(alto, spostamento.alto * quanto)
  posizione.add(scorrimento)
  obiettivo.add(scorrimento)

  return {
    posizione: posizione.toArray() as Punto,
    obiettivo: obiettivo.toArray() as Punto,
  }
}
