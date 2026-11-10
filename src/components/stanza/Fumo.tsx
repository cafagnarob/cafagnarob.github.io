/*
 * Fumo
 * Colonna di fumo sopra la tazza, nella posizione dell'empty
 * "fumo_tazza" (il rettangolo parte da lì e sale).
 *
 * - Billboard cilindrico: a ogni fotogramma il rettangolo ruota attorno
 *   alla verticale per guardare la camera, così da qualsiasi angolo
 *   sembra una colonna e mai un foglio visto di taglio.
 * - La geometria è spostata in modo che l'origine sia alla BASE:
 *   posizione e rotazione partono dal bordo della tazza.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA } from "../../config/stanza"
import {
  ALTEZZA_FUMO_M,
  LARGHEZZA_FUMO_M,
  SEGNAPOSTO_FUMO,
  VELOCITA_FUMO,
} from "../../config/fumo"
import { nomeGltf } from "../../utils/nomiGltf"
import { creaMaterialeFumo } from "../../materials/materialeFumo"
import { PERCORSO_DRACO } from "../../config/texture"

export function Fumo() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)

  const fumo = useMemo(() => {
    const geometria = new THREE.PlaneGeometry(LARGHEZZA_FUMO_M, ALTEZZA_FUMO_M)
    geometria.translate(0, ALTEZZA_FUMO_M / 2, 0) // origine alla base
    const mesh = new THREE.Mesh(geometria, creaMaterialeFumo())

    const segnaposto = scene.getObjectByName(nomeGltf(SEGNAPOSTO_FUMO))
    if (segnaposto) segnaposto.getWorldPosition(mesh.position)
    else console.warn(`Fumo: segnaposto "${SEGNAPOSTO_FUMO}" non trovato`)
    return mesh
  }, [scene])

  useFrame(({ camera, clock }) => {
    // Billboard cilindrico: ruota solo attorno alla verticale
    fumo.rotation.y = Math.atan2(
      camera.position.x - fumo.position.x,
      camera.position.z - fumo.position.z,
    )
    const materiale = fumo.material as THREE.ShaderMaterial
    materiale.uniforms.tempo.value = clock.elapsedTime * VELOCITA_FUMO
  })

  return <primitive object={fumo} />
}
