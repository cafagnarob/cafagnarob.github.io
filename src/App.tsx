/*
 * App
 * Componente radice. Contiene lo stato condiviso e la regia:
 * - armadioAperto: se l'armadio è aperto (ante aperte, LED acceso).
 * - capoInIspezione: id del lavoro portato davanti alla camera (o null).
 * - ritornoCapo: true mentre il capo torna al suo posto nell'armadio.
 * - cameraRef: controlli della camera, collegati nella Scena.
 *
 * Tutte le azioni partono dai click sugli oggetti 3D (niente pulsanti):
 * - apriArmadio / chiudiArmadio: click sull'armadio chiuso / sulle ante
 * - selezionaCapo: click su un capo → ispezione, camera bloccata
 * - rimettiCapo: click sul capo in ispezione → avvia il ritorno
 * - ritornoCompletato: il capo è tornato → fine ispezione, camera sbloccata
 * Stato e camera si aggiornano negli stessi handler, senza useEffect.
 */
import { useRef, useState } from "react"
import type { CameraControls } from "@react-three/drei"
import { Scena } from "./components/scena/Scena"
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
  )
}
