/*
 * App
 * Componente radice. Contiene lo stato condiviso e la regia:
 * - armadioAperto: se l'armadio è aperto (ante aperte, LED acceso).
 * - capoInIspezione: id del lavoro portato davanti alla camera (o null).
 * - ritornoCapo: true mentre il capo torna al suo posto nell'armadio.
 * - cameraRef: controlli della camera, collegati nella Scena.
 *
 * Flusso dell'ispezione, gestito negli handler (senza useEffect):
 * - selezionaCapo: avvia l'ispezione e blocca la camera, così il
 *   trascinamento ruota il capo e non la vista
 * - rimettiCapo: avvia il ritorno del capo nell'armadio
 * - ritornoCompletato: chiamato dalla scena quando il capo è tornato
 *   al suo posto: termina l'ispezione e sblocca la camera
 *
 * Interfaccia HTML sopra la scena:
 * - "Chiudi armadio": ad armadio aperto, senza capi in ispezione
 * - "Rimetti nell'armadio": durante l'ispezione
 */
import { useRef, useState } from "react"
import type { CameraControls } from "@react-three/drei"
import { Scena } from "./components/scena/Scena"
import { PulsanteChiudi } from "./components/interfaccia/PulsanteChiudi"
import { vaiAllaVista } from "./components/scena/regiaCamera"
import { VISTE } from "./config/camera"

export default function App() {
  const [armadioAperto, setArmadioAperto] = useState(false)
  const [capoInIspezione, setCapoInIspezione] = useState<string | null>(null)
  const [ritornoCapo, setRitornoCapo] = useState(false)
  const cameraRef = useRef<CameraControls>(null)

  const apriArmadio = () => {
    setArmadioAperto(true)
    vaiAllaVista(cameraRef.current, VISTE.armadio)
  }

  const chiudiArmadio = () => {
    setArmadioAperto(false)
    vaiAllaVista(cameraRef.current, VISTE.panoramica)
  }

  const selezionaCapo = (idLavoro: string) => {
    setCapoInIspezione(idLavoro)
    setRitornoCapo(false)
    if (cameraRef.current) cameraRef.current.enabled = false
  }

  const rimettiCapo = () => setRitornoCapo(true)

  const ritornoCompletato = () => {
    setCapoInIspezione(null)
    setRitornoCapo(false)
    if (cameraRef.current) cameraRef.current.enabled = true
  }

  return (
    <>
      <Scena
        armadioAperto={armadioAperto}
        capoInIspezione={capoInIspezione}
        ritornoCapo={ritornoCapo}
        onApriArmadio={apriArmadio}
        onSelezionaCapo={selezionaCapo}
        onRitornoCompletato={ritornoCompletato}
        cameraRef={cameraRef}
      />

      {armadioAperto && !capoInIspezione && (
        <PulsanteChiudi etichetta="Chiudi armadio" onClick={chiudiArmadio} />
      )}

      {capoInIspezione && !ritornoCapo && (
        <PulsanteChiudi
          etichetta="Rimetti nell'armadio"
          onClick={rimettiCapo}
        />
      )}
    </>
  )
}
