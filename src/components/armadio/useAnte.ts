/*
 * useAnte
 * Anima l'apertura e la chiusura delle ante dell'armadio.
 *
 * - All'avvio memorizza per ogni anta la rotazione CHIUSA (quella del
 *   file glTF) e calcola quella APERTA: la chiusa ruotata attorno
 *   all'asse verticale (Y) di ANGOLO_APERTURA nella sua direzione.
 * - A ogni fotogramma ogni anta si avvicina alla rotazione obiettivo
 *   con slerp (interpolazione tra quaternioni, sempre sul percorso
 *   più breve) e uno smorzamento indipendente dal frame rate.
 * - Lo zaino (capo_7) è figlio di anta_sx: si muove con lei da solo.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import {
  ANTE_ARMADIO,
  ANGOLO_APERTURA_GRADI,
  VELOCITA_ANTE,
} from "../../config/armadio"

type StatoAnta = {
  oggetto: THREE.Object3D
  chiusa: THREE.Quaternion
  aperta: THREE.Quaternion
}

const ASSE_VERTICALE = new THREE.Vector3(0, 1, 0)

export function useAnte(scene: THREE.Object3D, aperto: boolean) {
  /* Rotazioni chiusa e aperta di ogni anta, calcolate una volta */
  const ante = useMemo(() => {
    const lista: StatoAnta[] = []
    const angolo = THREE.MathUtils.degToRad(ANGOLO_APERTURA_GRADI)

    for (const [nome, { direzione }] of Object.entries(ANTE_ARMADIO)) {
      const oggetto = scene.getObjectByName(nome)
      if (!oggetto) continue

      const chiusa = oggetto.quaternion.clone()
      // Rotazione attorno all'asse verticale, applicata DOPO quella chiusa
      const aperta = new THREE.Quaternion()
        .setFromAxisAngle(ASSE_VERTICALE, direzione * angolo)
        .multiply(chiusa)

      lista.push({ oggetto, chiusa, aperta })
    }
    return lista
  }, [scene])

  /* A ogni fotogramma: avvicina ogni anta alla rotazione obiettivo */
  useFrame((_, delta) => {
    const frazione = 1 - Math.exp(-VELOCITA_ANTE * delta)
    for (const { oggetto, chiusa, aperta } of ante) {
      oggetto.quaternion.slerp(aperto ? aperta : chiusa, frazione)
    }
  })
}
