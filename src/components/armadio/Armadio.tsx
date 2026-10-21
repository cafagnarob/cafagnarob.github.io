/*
 * Armadio
 * Mostra l'armadio bakeato e gestisce tutta la sua interazione.
 *
 * - useMaterialiBake / useAnte: materiali bakeati e apertura delle ante.
 * - Armadio CHIUSO: un click ovunque lo apre (onApri).
 *   Armadio APERTO: passando sopra un capo lo si evidenzia, con un
 *   click lo si porta in ispezione (onSelezionaCapo).
 *   Durante l'ISPEZIONE hover e click vengono ignorati.
 * - capoSottoMouse è un ref: cambia a ogni movimento senza re-render.
 * - useFrame, a ogni fotogramma:
 *     neon → sfarfallio continuo
 *     LED  → acceso se aperto, spento se chiuso
 *     evidenziazione → hover, oppure LUMINOSITA_ISPEZIONE per il capo
 *                      in ispezione (il clone condivide il materiale)
 *     visibilità → gli originali del capo in ispezione sono nascosti
 *                  (al loro posto vola il clone)
 */
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useMaterialiBake } from "./useMaterialiBake"
import { useAnte } from "./useAnte"
import { Ispezione } from "./Ispezione"
import { intensitaNeon } from "../../utils/sfarfallio"
import {
  CAPI_CLICCABILI,
  VELOCITA_EVIDENZIAZIONE,
  VELOCITA_LED,
} from "../../config/armadio"
import { LUMINOSITA_ISPEZIONE } from "../../config/ispezione"

const PERCORSO_MODELLO = "/models/armadio.glb"

type ArmadioProps = {
  aperto: boolean
  capoInIspezione: string | null
  ritornoCapo: boolean
  onApri: () => void
  onSelezionaCapo: (idLavoro: string) => void
  onRitornoCompletato: () => void
}

/* Restituisce l'id del lavoro dell'oggetto colpito, se è un capo */
function lavoroColpito(evento: ThreeEvent<PointerEvent | MouseEvent>) {
  return CAPI_CLICCABILI[evento.object.name] as string | undefined
}

export function Armadio({
  aperto,
  capoInIspezione,
  ritornoCapo,
  onApri,
  onSelezionaCapo,
  onRitornoCompletato,
}: ArmadioProps) {
  const { scene } = useGLTF(PERCORSO_MODELLO)
  const materiali = useMaterialiBake(scene)
  useAnte(scene, aperto)

  const capoSottoMouse = useRef<string | null>(null)
  const inIspezione = capoInIspezione !== null

  /* Oggetti 3D dei capi, trovati una volta per nome */
  const oggettiCapi = useMemo(
    () =>
      Object.keys(CAPI_CLICCABILI)
        .map((nome) => scene.getObjectByName(nome))
        .filter((oggetto): oggetto is THREE.Object3D => oggetto !== undefined),
    [scene],
  )

  /* Animazioni a ogni fotogramma */
  useFrame(({ clock }, delta) => {
    const neon = intensitaNeon(clock.elapsedTime)
    const frazioneLed = 1 - Math.exp(-VELOCITA_LED * delta)
    const frazioneEvidenziazione =
      1 - Math.exp(-VELOCITA_EVIDENZIAZIONE * delta)
    const obiettivoLed = aperto ? 1 : 0

    for (const [nomeOggetto, materiale] of Object.entries(materiali)) {
      const {
        intensitaLed,
        intensitaNeon: uniformNeon,
        evidenziazione,
      } = materiale.uniforms
      uniformNeon.value = neon
      intensitaLed.value += (obiettivoLed - intensitaLed.value) * frazioneLed

      const lavoro = CAPI_CLICCABILI[nomeOggetto]
      let obiettivo = 0
      if (lavoro !== undefined && lavoro === capoInIspezione) {
        obiettivo = LUMINOSITA_ISPEZIONE
      } else if (
        aperto &&
        !inIspezione &&
        lavoro !== undefined &&
        lavoro === capoSottoMouse.current
      ) {
        obiettivo = 1
      }
      evidenziazione.value +=
        (obiettivo - evidenziazione.value) * frazioneEvidenziazione
    }

    // Gli originali del capo in ispezione restano nascosti finché il clone è fuori
    for (const oggetto of oggettiCapi) {
      oggetto.visible = CAPI_CLICCABILI[oggetto.name] !== capoInIspezione
    }
  })

  /* Click: chiuso → apre; aperto → ispeziona il capo colpito */
  const gestisciClick = (evento: ThreeEvent<MouseEvent>) => {
    evento.stopPropagation()
    if (inIspezione) return
    if (!aperto) {
      onApri()
      return
    }
    const lavoro = lavoroColpito(evento)
    if (lavoro) onSelezionaCapo(lavoro)
  }

  /* Movimento: capo sotto il mouse e forma del cursore */
  const gestisciMovimento = (evento: ThreeEvent<PointerEvent>) => {
    evento.stopPropagation()
    if (inIspezione) return
    const lavoro = aperto ? lavoroColpito(evento) : undefined
    capoSottoMouse.current = lavoro ?? null
    document.body.style.cursor =
      !aperto || lavoro !== undefined ? "pointer" : "auto"
  }

  const gestisciUscita = () => {
    capoSottoMouse.current = null
    if (!inIspezione) document.body.style.cursor = "auto"
  }

  return (
    <>
      <primitive
        object={scene}
        onClick={gestisciClick}
        onPointerMove={gestisciMovimento}
        onPointerOut={gestisciUscita}
      />

      {capoInIspezione && (
        <Ispezione
          key={capoInIspezione}
          scene={scene}
          idLavoro={capoInIspezione}
          ritorno={ritornoCapo}
          onRitornoCompletato={onRitornoCompletato}
        />
      )}
    </>
  )
}

useGLTF.preload(PERCORSO_MODELLO)
