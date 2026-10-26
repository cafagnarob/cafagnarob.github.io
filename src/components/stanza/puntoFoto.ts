/*
 * Punto della foto
 * Centro della foto del comodino (mesh foto + vetro), registrato da
 * TracciaFoto quando il modello è caricato. Lo usa la regia della camera
 * per portare la foto nello spazio libero dal modale del profilo.
 * Come viste e schermi: un piccolo registro fuori da React.
 */
import type * as THREE from "three"

let punto: THREE.Vector3 | null = null

export function registraPuntoFoto(centro: THREE.Vector3) {
  punto = centro
}

export function puntoFoto() {
  return punto
}
