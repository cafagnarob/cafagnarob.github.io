/*
 * Oggetti luminosi
 * Elenco degli oggetti che ricevono il bloom: chi crea un oggetto
 * luminoso lo registra (materialiStanza: insegna; FuoriFinestra: auto e
 * lampeggiante). Effetti.tsx li aggiunge alla selezione del bloom.
 * Come viste e schermi: un piccolo registro fuori da React, perché gli
 * oggetti nascono in componenti diversi da quello che li usa.
 */
import type * as THREE from "three"

const oggetti = new Set<THREE.Object3D>()

export function registraLuminoso(oggetto: THREE.Object3D) {
  oggetti.add(oggetto)
}

export function oggettiLuminosi(): ReadonlySet<THREE.Object3D> {
  return oggetti
}
