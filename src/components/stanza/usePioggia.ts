/*
 * usePioggia
 * Fa avanzare il tempo dello shader della pioggia a ogni fotogramma.
 */
import type * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { VELOCITA_PIOGGIA } from "../../config/pioggia"

export function usePioggia(materiale: THREE.ShaderMaterial | null) {
  useFrame(({ clock }) => {
    if (materiale)
      materiale.uniforms.tempo.value = clock.elapsedTime * VELOCITA_PIOGGIA
  })
}
