/*
 * Armadio
 * Carica il modello armadio.glb e lo inserisce nella scena.
 *
 * - useGLTF (drei) scarica il file e lo decomprime (Draco
 *   compreso). Mentre carica, "sospende" il componente: per
 *   questo chi lo usa deve avvolgerlo in <Suspense>.
 * - <primitive> inserisce nella scena un oggetto three.js già
 *   esistente (la scena del file) invece di crearne uno nuovo.
 * - useGLTF.preload avvia il download appena questo modulo viene
 *   importato, prima ancora che il componente venga mostrato.
 *
 * Per ora gli oggetti sono grigi (materiale standard di three.js):
 * i PNG bakeati li aggiungeremo nel passo successivo.
 */
import { useGLTF } from "@react-three/drei"

const PERCORSO_MODELLO = "/models/armadio.glb"

export function Armadio() {
  const { scene } = useGLTF(PERCORSO_MODELLO)
  return <primitive object={scene} />
}

useGLTF.preload(PERCORSO_MODELLO)
