/*
 * useMaterialiBake
 * Carica tutte le texture bakeate dell'armadio (KTX2 o PNG, vedi
 * config/texture.ts) e assegna a ogni oggetto della scena il suo
 * materiale. Restituisce la lista dei materiali creati, così il
 * componente può animarne le uniform (LED, neon).
 *
 * - useTextureBake: con USA_KTX2 attivo legge i .ktx2 con lo stesso nome
 *   dei PNG; restituisce lo stesso oggetto "<oggetto>_<passaggio>" → texture.
 * - useMemo: l'assegnazione avviene una sola volta, durante il
 *   render, prima del primo disegno (niente fotogramma grigio).
 * - Il LED parte a 0: l'armadio all'inizio è chiuso.
 */
import { useMemo } from "react"
import * as THREE from "three"
import {
  CARTELLA_TEXTURE_ARMADIO,
  PASSAGGI_ARMADIO,
} from "../../config/armadio"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"
import {
  precaricaTextureBake,
  useTextureBake,
} from "../../utils/useTextureBake"

/* Tutte le texture dell'armadio, indicizzate per "<oggetto>_<passaggio>".
   I percorsi restano .png: useTextureBake li converte in .ktx2 se serve */
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
): Record<string, THREE.ShaderMaterial> {
  const texture = useTextureBake(URL_TEXTURE)

  return useMemo(() => {
    Object.values(texture).forEach(preparaTextureBake)
    const materiali: Record<string, THREE.ShaderMaterial> = {}

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
      materiali[oggetto.name] = materiale
    })

    return materiali
  }, [scene, texture])
}

precaricaTextureBake(URL_TEXTURE)
