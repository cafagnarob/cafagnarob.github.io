/*
 * Armadio
 * Carica il modello armadio.glb e tutti i PNG bakeati, assegna a ogni
 * oggetto il suo materiale bakeato e anima le luci.
 *
 * - URL_TEXTURE: tutti i PNG, indicizzati per "<oggetto>_<passaggio>".
 * - useMemo: assegna i materiali una sola volta, prima del primo
 *   disegno (niente fotogramma grigio), e restituisce la lista dei
 *   materiali creati per poterli animare.
 * - useFrame: a ogni fotogramma aggiorna l'intensità del neon in tutti
 *   i materiali. Modifica direttamente l'uniform dello shader, senza
 *   passare dallo stato di React (nessun re-render).
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"
import {
  CARTELLA_TEXTURE_ARMADIO,
  PASSAGGI_ARMADIO,
} from "../../config/armadio"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"
import { intensitaNeon } from "../../utils/sfarfallio"

const PERCORSO_MODELLO = "/models/armadio.glb"

/* Tutti i PNG dell'armadio, indicizzati per "<oggetto>_<passaggio>" */
const URL_TEXTURE: Record<string, string> = Object.fromEntries(
  Object.entries(PASSAGGI_ARMADIO).flatMap(([oggetto, passaggi]) =>
    passaggi.map((passaggio) => [
      `${oggetto}_${passaggio}`,
      `${CARTELLA_TEXTURE_ARMADIO}/${oggetto}_${passaggio}.png`,
    ]),
  ),
)

export function Armadio() {
  const { scene } = useGLTF(PERCORSO_MODELLO)
  const texture = useTexture(URL_TEXTURE)

  /* Assegna i materiali bakeati e restituisce la lista dei materiali */
  const materiali = useMemo(() => {
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
      oggetto.material = materiale
      lista.push(materiale)
    })

    return lista
  }, [scene, texture])

  /* Animazione: sfarfallio del neon a ogni fotogramma */
  useFrame(({ clock }) => {
    const valore = intensitaNeon(clock.elapsedTime)
    for (const materiale of materiali) {
      materiale.uniforms.intensitaNeon.value = valore
    }
  })

  return <primitive object={scene} />
}

useGLTF.preload(PERCORSO_MODELLO)
useTexture.preload(Object.values(URL_TEXTURE))
