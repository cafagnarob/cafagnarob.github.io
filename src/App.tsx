/*
 * App
 * Componente radice. Contiene lo stato condiviso e la regia.
 *
 * Stato:
 * - armadioAperto: ante aperte, LED acceso
 * - capoInIspezione: id del lavoro in primo piano (o null)
 * - ritornoCapo: il capo 3D (senza turntable) sta tornando al suo posto
 * - partenzaVetrina: rettangolo a schermo del capo cliccato, punto di
 *   partenza del volo del render di CLO (null = vetrina chiusa)
 *
 * Capo CON turntable (nessun modello 3D in volo):
 *   apertura armadio → precarica i render di tutti i capi
 *   click sul capo   → selezionaCapo: il capo 3D si nasconde e al suo
 *                      posto il render vola al centro (VisoreTurntable)
 *   click in vetrina → il render torna nel punto di partenza, poi
 *                      chiudiVetrina: il capo 3D riappare lì
 * Capo SENZA turntable: ispezione 3D (click sul capo per riporlo).
 * Stato e camera si aggiornano negli stessi handler, senza useEffect.
 */
import { useRef, useState } from "react"
import type { CameraControls } from "@react-three/drei"
import { Scena } from "./components/scena/Scena"
import { VisoreTurntable } from "./components/interfaccia/VisoreTurntable"
import { vaiAllaVista } from "./components/scena/regiaCamera"
import { VISTE } from "./config/camera"
import { LAVORI_MODA } from "./data/lavoriModa"
import { precaricaTurntable } from "./utils/turntable"
import type { Rettangolo } from "./utils/rettangoloSchermo"

export default function App() {
  const [armadioAperto, setArmadioAperto] = useState(false)
  const [capoInIspezione, setCapoInIspezione] = useState<string | null>(null)
  const [ritornoCapo, setRitornoCapo] = useState(false)
  const [partenzaVetrina, setPartenzaVetrina] = useState<Rettangolo | null>(
    null,
  )
  const cameraRef = useRef<CameraControls>(null)

  const lavoro = capoInIspezione ? LAVORI_MODA[capoInIspezione] : undefined

  /* Blocca la camera durante l'ispezione: il trascinamento ruota il capo */
  const bloccaCamera = (bloccata: boolean) => {
    if (cameraRef.current) cameraRef.current.enabled = !bloccata
  }

  /* --- Armadio --- */
  const apriArmadio = () => {
    setArmadioAperto(true)
    vaiAllaVista(cameraRef.current, VISTE.armadio)
    // Il primo fotogramma serve nell'istante del click: si scaricano ora
    for (const { turntable } of Object.values(LAVORI_MODA)) {
      if (turntable) precaricaTurntable(turntable)
    }
  }

  const chiudiArmadio = () => {
    setArmadioAperto(false)
    vaiAllaVista(cameraRef.current, VISTE.panoramica)
  }

  /* --- Capo --- */
  const selezionaCapo = (idLavoro: string, rettangolo: Rettangolo) => {
    setCapoInIspezione(idLavoro)
    setRitornoCapo(false)
    bloccaCamera(true)
    if (LAVORI_MODA[idLavoro]?.turntable) setPartenzaVetrina(rettangolo)
  }

  /* Ispezione 3D (capi senza turntable) */
  const rimettiCapo = () => setRitornoCapo(true)

  const ritornoCompletato = () => {
    setCapoInIspezione(null)
    setRitornoCapo(false)
    bloccaCamera(false)
  }

  /* Vetrina (capi con turntable): il render è tornato al suo posto */
  const chiudiVetrina = () => {
    setPartenzaVetrina(null)
    setCapoInIspezione(null)
    bloccaCamera(false)
  }

  return (
    <>
      <Scena
        armadioAperto={armadioAperto}
        capoInIspezione={capoInIspezione}
        ritornoCapo={ritornoCapo}
        onApriArmadio={apriArmadio}
        onChiudiArmadio={chiudiArmadio}
        onSelezionaCapo={selezionaCapo}
        onRimettiCapo={rimettiCapo}
        onRitornoCompletato={ritornoCompletato}
        cameraRef={cameraRef}
      />

      {lavoro?.turntable && partenzaVetrina && (
        <VisoreTurntable
          key={capoInIspezione}
          titolo={lavoro.titolo}
          turntable={lavoro.turntable}
          partenza={partenzaVetrina}
          onChiuso={chiudiVetrina}
        />
      )}
    </>
  )
}
