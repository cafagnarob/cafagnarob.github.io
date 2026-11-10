/*
 * Foto del profilo: registro condiviso
 * Dati della foto del comodino, scritti dalla stanza e letti fuori:
 * - punto: centro nel mondo (registrato da TracciaFoto) → la regia della
 *   camera porta la foto nello spazio libero dal modale
 * - rettangolo: posizione sullo schermo, aggiornata a ogni fotogramma
 *   nella vista del letto (TracciaFoto) → partenza del volo in primo piano
 * - mesh: la mesh "foto" (registrata da FotoProfilo) → viene nascosta
 *   mentre la copia è in primo piano
 * Un piccolo registro fuori da React, come viste e schermi.
 */
import type * as THREE from "three"
import type { Rettangolo } from "../../utils/rettangoloSchermo"

let punto: THREE.Vector3 | null = null
let rettangolo: Rettangolo | null = null
let mesh: THREE.Mesh | null = null

export const registraPuntoFoto = (centro: THREE.Vector3) => {
  punto = centro
}
export const puntoFoto = () => punto

export const registraRettangoloFoto = (r: Rettangolo) => {
  rettangolo = r
}
export const rettangoloFoto = () => rettangolo

export const registraMeshFoto = (m: THREE.Mesh) => {
  mesh = m
}
export const meshFoto = () => mesh
