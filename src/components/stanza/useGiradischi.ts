/*
 * useGiradischi
 * Anima braccio e vinile in base allo stato del disco (store audio).
 *
 * - Braccio: "progresso" da 0 (riposo) a 1 (sul disco), che avanza a
 *   velocità costante (1 / DURATA_BRACCIO_S al secondo) con una curva
 *   morbida. Arriva esattamente in DURATA_BRACCIO_S, quando parte la
 *   musica. Fermato a metà, torna indietro da dove si trova.
 *   La rotazione è applicata SOPRA quella di riposo, attorno all'asse
 *   verticale locale (Y in three.js = Z in Blender).
 * - Vinile: la velocità si avvicina a quella di regime (o a zero) in
 *   modo graduale, come un vero piatto; gira in senso orario visto
 *   dall'alto (rotazione negativa attorno a Y).
 * - I valori che cambiano a ogni fotogramma stanno in un ref, non nello store.
 */
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useAppSelector } from "../../store/hooks"
import { nomeGltf } from "../../utils/nomiGltf"
import { easeInOutCubic } from "../../utils/animazione"
import {
  ACCELERAZIONE_DISCO,
  ANGOLO_BRACCIO_GRADI,
  DURATA_BRACCIO_S,
  GIRI_AL_MINUTO,
  NOME_BRACCIO,
  NOME_VINILE,
} from "../../config/giradischi"

const ASSE_VERTICALE = new THREE.Vector3(0, 1, 0)
const ANGOLO_BRACCIO = THREE.MathUtils.degToRad(ANGOLO_BRACCIO_GRADI)
const VELOCITA_DISCO = (GIRI_AL_MINUTO / 60) * Math.PI * 2 // radianti al secondo
const rotazione = new THREE.Quaternion() // riutilizzato a ogni fotogramma

export function useGiradischi(scena: THREE.Object3D) {
  const inRiproduzione = useAppSelector((s) => s.audio.discoInRiproduzione)

  const parti = useMemo(() => {
    const braccio = scena.getObjectByName(nomeGltf(NOME_BRACCIO))
    const vinile = scena.getObjectByName(nomeGltf(NOME_VINILE))
    if (!braccio || !vinile)
      console.warn("Giradischi: braccio o vinile non trovati")
    return { braccio, vinile, riposo: braccio?.quaternion.clone() }
  }, [scena])

  const animazione = useRef({ progresso: 0, velocita: 0 })

  useFrame((_, delta) => {
    const { braccio, vinile, riposo } = parti
    if (!braccio || !vinile || !riposo) return
    const a = animazione.current

    // Braccio: avanza o torna a velocità costante
    const passo = delta / DURATA_BRACCIO_S
    a.progresso = inRiproduzione
      ? Math.min(1, a.progresso + passo)
      : Math.max(0, a.progresso - passo)
    rotazione.setFromAxisAngle(
      ASSE_VERTICALE,
      ANGOLO_BRACCIO * easeInOutCubic(a.progresso),
    )
    // premultiply: rotazione attorno alla verticale della SCENA, non agli
    // assi locali del braccio (che possono essere inclinati)
    braccio.quaternion.copy(riposo).premultiply(rotazione)

    // Vinile: accelera o rallenta gradualmente
    const obiettivo = inRiproduzione ? VELOCITA_DISCO : 0
    a.velocita +=
      (obiettivo - a.velocita) * (1 - Math.exp(-ACCELERAZIONE_DISCO * delta))
    vinile.rotateY(-a.velocita * delta)
  })
}
