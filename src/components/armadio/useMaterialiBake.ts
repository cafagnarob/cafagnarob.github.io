/*
 * useMaterialiBake
 * Carica tutti i PNG bakeati dell'armadio e assegna a ogni oggetto
 * della scena il suo materiale. Restituisce la lista dei materiali
 * creati, così il componente può animarne le uniform (LED, neon).
 *
 * - useMemo: l'assegnazione avviene una sola volta, durante il
 *   render, prima del primo disegno (niente fotogramma grigio).
 * - Il LED parte a 0: l'armadio all'inizio è chiuso.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import {
  CARTELLA_TEXTURE_ARMADIO,
  PASSAGGI_ARMADIO,
} from "../../config/armadio"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"

/* Tutti i PNG dell'armadio, indicizzati per "<oggetto>_<passaggio>" */
const URL_TEXTURE: Record<string, string> = Object.fromEntries(
  Object.entries(PASSAGGI_ARMADIO).flatMap(([oggetto, passaggi]) =>
    passaggi.map((passaggio) => [
      `${oggetto}_${passaggio}`,
      `${CARTELLA_TEXTURE_ARMADIO}/${oggetto}_${passaggio}.png`,
    ]),
  ),
)

export function useMaterialiBake(
  scene: THREE.Object3D,
): THREE.ShaderMaterial[] {
  const texture = useTexture(URL_TEXTURE)

  return useMemo(() => {
    Object.values(texture).forEach(preparaTextureBake)
    const lista: THREE.ShaderMaterial[] = []

    scene.traverse((oggetto) => {
      if (!(oggetto instanceof THREE.Mesh)) return
      if (!(oggetto.name in PASSAGGI_ARMADIO)) return

      const materiale = creaMaterialeBake({
        base: texture[`${oggetto.name}_base`],
        led: texture[`${oggetto.name}_led`],
        neon: texture[`${oggetto.name}_neon`],
      })
      materiale.uniforms.intensitaLed.value = 0 // armadio chiuso all'avvio
      oggetto.material = materiale
      lista.push(materiale)
    })

    return lista
  }, [scene, texture])
}

useTexture.preload(Object.values(URL_TEXTURE))
