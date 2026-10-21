/*
 * Armadio
 * Carica il modello armadio.glb e tutti i PNG bakeati, e assegna
 * a ogni oggetto il suo materiale bakeato.
 *
 * - URL_TEXTURE: costruito dalla configurazione, contiene tutti i PNG
 *   come { "anta_sx_base": "/textures/armadio/anta_sx_base.png", ... }
 * - useTexture (drei) carica tutte le texture in parallelo e, come
 *   useGLTF, sospende il componente finché non sono pronte.
 * - scene.traverse visita ogni oggetto del file: se è una mesh
 *   presente nella configurazione, riceve il materiale bakeato.
 *   Si lavora sulla scena originale, quindi la gerarchia resta
 *   intatta (lo zaino continua a seguire l'anta).
 * - useMemo esegue l'assegnazione una sola volta, durante il render,
 *   PRIMA che la scena venga mostrata: così non si vede mai il
 *   modello grigio. Con useEffect avverrebbe dopo il primo
 *   disegno, con un fotogramma grigio.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useGLTF, useTexture } from "@react-three/drei"
import {
  CARTELLA_TEXTURE_ARMADIO,
  PASSAGGI_ARMADIO,
} from "../../config/armadio"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"

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

  useMemo(() => {
    Object.values(texture).forEach(preparaTextureBake)

    scene.traverse((oggetto) => {
      if (!(oggetto instanceof THREE.Mesh)) return
      if (!(oggetto.name in PASSAGGI_ARMADIO)) return

      oggetto.material = creaMaterialeBake({
        base: texture[`${oggetto.name}_base`],
        led: texture[`${oggetto.name}_led`],
        neon: texture[`${oggetto.name}_neon`],
      })
    })
  }, [scene, texture])

  return <primitive object={scene} />
}

useGLTF.preload(PERCORSO_MODELLO)
useTexture.preload(Object.values(URL_TEXTURE))
