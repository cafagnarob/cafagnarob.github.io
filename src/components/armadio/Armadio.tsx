/*
 * Armadio
 * Mostra l'armadio bakeato e gestisce la sua interazione.
 *
 * - useMaterialiBake: assegna i materiali con i PNG bakeati.
 * - useAnte: anima l'apertura/chiusura delle ante.
 * - useFrame: anima le luci a ogni fotogramma:
 *     neon → sfarfallio continuo
 *     LED  → si accende quando l'armadio è aperto, si spegne quando
 *            è chiuso, con smorzamento indipendente dal frame rate.
 * - Click su qualsiasi parte dell'armadio → onClick (gestito in App).
 *   stopPropagation evita che il click "attraversi" l'armadio e
 *   arrivi anche agli oggetti dietro.
 * - Il cursore diventa una mano al passaggio, anche se l'armadio è
 *   cliccabile su mobile senza hover (il tocco genera il click).
 */
import { useGLTF } from "@react-three/drei"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useMaterialiBake } from "./useMaterialiBake"
import { useAnte } from "./useAnte"
import { intensitaNeon } from "../../utils/sfarfallio"
import { VELOCITA_LED } from "../../config/armadio"

const PERCORSO_MODELLO = "/models/armadio.glb"

type ArmadioProps = {
  aperto: boolean
  onClick: () => void
}

export function Armadio({ aperto, onClick }: ArmadioProps) {
  const { scene } = useGLTF(PERCORSO_MODELLO)
  const materiali = useMaterialiBake(scene)
  useAnte(scene, aperto)

  /* Animazione delle luci a ogni fotogramma */
  useFrame(({ clock }, delta) => {
    const neon = intensitaNeon(clock.elapsedTime)
    const frazioneLed = 1 - Math.exp(-VELOCITA_LED * delta)
    const obiettivoLed = aperto ? 1 : 0

    for (const materiale of materiali) {
      const { intensitaLed, intensitaNeon: uniformNeon } = materiale.uniforms
      uniformNeon.value = neon
      intensitaLed.value += (obiettivoLed - intensitaLed.value) * frazioneLed
    }
  })

  const gestisciClick = (evento: ThreeEvent<MouseEvent>) => {
    evento.stopPropagation()
    onClick()
  }

  return (
    <primitive
      object={scene}
      onClick={gestisciClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    />
  )
}

useGLTF.preload(PERCORSO_MODELLO)
