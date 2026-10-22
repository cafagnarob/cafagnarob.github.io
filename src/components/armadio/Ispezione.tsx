/*
 * Ispezione
 * Porta un capo davanti alla camera, in posizione frontale, e lo
 * rende ruotabile con il trascinamento.
 *
 * 1. CLONE: copia gli oggetti del lavoro (es. zaino + minuterie),
 *    condividendo geometria e materiale con gli originali.
 * 2. CENTRATURA: calcola il centro dell'ingombro (bounding box) e
 *    sposta le copie in modo che il centro coincida con il "perno":
 *    così il capo ruota attorno a sé stesso e non attorno alla sua
 *    origine.
 * 3. POSE:
 *    - partenza: dove si trova il capo nell'armadio
 *    - arrivo: davanti alla camera, rivolto verso di essa (lookAt
 *      orienta l'asse +Z, il davanti dei capi di CLO, verso la camera),
 *      più l'eventuale correzione del capo, e con una scala che lo fa
 *      stare nello schermo
 * 4. VOLO: a ogni fotogramma il perno si avvicina alla posa obiettivo
 *    (arrivo, oppure partenza se "ritorno" è attivo). Quando il ritorno
 *    è completo, avvisa con onRitornoCompletato (una sola volta).
 * 5. ROTAZIONE: PresentationControls rende il capo ruotabile trascinando
 *    ovunque sullo schermo (global); "snap" lo riporta frontale al rilascio.
 * “6. CLICK: un click sul capo (non un trascinamento) lo rimette nell’armadio.”
 *
 */
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { PresentationControls } from "@react-three/drei"
import { CAPI_CLICCABILI } from "../../config/armadio"
import {
  DISTANZA_ISPEZIONE,
  OCCUPAZIONE_SCHERMO,
  ROTAZIONE_FRONTALE_GRADI,
  SOGLIA_TRASCINAMENTO_PX,
  VELOCITA_ISPEZIONE,
} from "../../config/ispezione"

type Posa = {
  posizione: THREE.Vector3
  rotazione: THREE.Quaternion
  scala: number
}

type IspezioneProps = {
  scene: THREE.Object3D
  idLavoro: string
  ritorno: boolean
  onClickCapo: () => void
  onRitornoCompletato: () => void
}

const ASSE_VERTICALE = new THREE.Vector3(0, 1, 0)

export function Ispezione({
  scene,
  idLavoro,
  ritorno,
  onClickCapo,
  onRitornoCompletato,
}: IspezioneProps) {
  const camera = useThree((stato) => stato.camera) as THREE.PerspectiveCamera
  const dimensioniSchermo = useThree((stato) => stato.size)
  const ritornoAvvisato = useRef(false)

  /* 1-2. Copie centrate del capo e posa di partenza (una volta per capo) */
  const { perno, contenitore, partenza, ingombro } = useMemo(() => {
    scene.updateMatrixWorld(true)

    // Oggetti originali di questo lavoro
    const originali: THREE.Object3D[] = []
    scene.traverse((oggetto) => {
      if (CAPI_CLICCABILI[oggetto.name] === idLavoro) originali.push(oggetto)
    })

    // Il primo oggetto fa da riferimento: le copie sono espresse
    // rispetto alla sua posizione e rotazione nel mondo
    const riferimento = originali[0]
    const posizioneRif = riferimento.getWorldPosition(new THREE.Vector3())
    const rotazioneRif = riferimento.getWorldQuaternion(new THREE.Quaternion())
    const rotazioneRifInversa = rotazioneRif.clone().invert()

    const contenitore = new THREE.Group()
    for (const originale of originali) {
      const copia = originale.clone(false)
      copia.visible = true
      copia.position
        .copy(originale.getWorldPosition(new THREE.Vector3()))
        .sub(posizioneRif)
        .applyQuaternion(rotazioneRifInversa)
      copia.quaternion
        .copy(rotazioneRifInversa)
        .multiply(originale.getWorldQuaternion(new THREE.Quaternion()))
      copia.scale.copy(originale.getWorldScale(new THREE.Vector3()))
      contenitore.add(copia)
    }

    // Centratura: il centro dell'ingombro va nell'origine del contenitore
    const scatola = new THREE.Box3().setFromObject(contenitore)
    const centro = scatola.getCenter(new THREE.Vector3())
    const ingombro = scatola.getSize(new THREE.Vector3())
    for (const copia of contenitore.children) copia.position.sub(centro)

    // Posa di partenza: dove si trova il centro del capo nell'armadio
    const partenza: Posa = {
      posizione: centro.clone().applyQuaternion(rotazioneRif).add(posizioneRif),
      rotazione: rotazioneRif.clone(),
      scala: 1,
    }

    // Il perno parte dalla posa di partenza
    const perno = new THREE.Group()
    perno.position.copy(partenza.posizione)
    perno.quaternion.copy(partenza.rotazione)

    return { perno, contenitore, partenza, ingombro }
  }, [scene, idLavoro])

  /* 3. Posa di arrivo: ricalcolata se cambiano camera o schermo */
  const arrivo = useMemo((): Posa => {
    const direzione = camera.getWorldDirection(new THREE.Vector3())
    const posizione = camera.position
      .clone()
      .addScaledVector(direzione, DISTANZA_ISPEZIONE)

    // Rotazione frontale: l'asse +Z del capo punta verso la camera...
    const guida = new THREE.Object3D()
    guida.position.copy(posizione)
    guida.lookAt(camera.position)
    // ...più l'eventuale correzione di questo capo
    const correzione = THREE.MathUtils.degToRad(
      ROTAZIONE_FRONTALE_GRADI[idLavoro] ?? 0,
    )
    guida.quaternion.multiply(
      new THREE.Quaternion().setFromAxisAngle(ASSE_VERTICALE, correzione),
    )

    // Scala: il capo occupa OCCUPAZIONE_SCHERMO del lato più corto visibile
    const altezzaVisibile =
      2 *
      DISTANZA_ISPEZIONE *
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const larghezzaVisibile =
      altezzaVisibile * (dimensioniSchermo.width / dimensioniSchermo.height)
    const spazio =
      Math.min(altezzaVisibile, larghezzaVisibile) * OCCUPAZIONE_SCHERMO
    // Solo larghezza e altezza: è ciò che si vede di fronte (come nel render)
    const lato = Math.max(ingombro.x, ingombro.y)

    return {
      posizione,
      rotazione: guida.quaternion.clone(),
      scala: spazio / lato,
    }
  }, [camera, dimensioniSchermo, idLavoro, ingombro])

  /* 4. Volo verso la posa obiettivo */
  useFrame((_, delta) => {
    const obiettivo = ritorno ? partenza : arrivo
    const frazione = 1 - Math.exp(-VELOCITA_ISPEZIONE * delta)

    // Nascosto mentre il render di CLO è completamente visibile sopra di lui
    perno.position.lerp(obiettivo.posizione, frazione)
    perno.quaternion.slerp(obiettivo.rotazione, frazione)
    perno.scale.setScalar(
      THREE.MathUtils.lerp(perno.scale.x, obiettivo.scala, frazione),
    )

    // Ritorno completato: avvisa una sola volta
    const arrivato = perno.position.distanceTo(partenza.posizione) < 0.005
    if (ritorno && arrivato && !ritornoAvvisato.current) {
      ritornoAvvisato.current = true
      onRitornoCompletato()
    }
  })

  /* Click sul capo: lo rimette nell'armadio, ma solo se era un click vero
     (non la fine di un trascinamento) e se non sta già tornando */
  const gestisciClick = (evento: ThreeEvent<MouseEvent>) => {
    evento.stopPropagation()
    if (evento.delta > SOGLIA_TRASCINAMENTO_PX || ritorno) return
    onClickCapo()
  }

  /* 5. Rotazione con il trascinamento */
  return (
    <primitive object={perno}>
      <PresentationControls
        global
        snap
        cursor
        speed={1.5}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Infinity, Infinity]}
      >
        <primitive object={contenitore} onClick={gestisciClick} />
      </PresentationControls>
    </primitive>
  )
}
