/*
 * App
 * Componente radice. Contiene lo stato condiviso e la regia:
 * - armadioAperto: se l'armadio è aperto (ante aperte, LED acceso).
 * - cameraRef: riferimento ai controlli della camera, passato alla
 *   Scena che lo collega a <CameraControls>. Vive qui perché anche
 *   l'interfaccia HTML (es. pulsante "chiudi") dovrà muovere la camera.
 *
 * gestisciClickArmadio fa tutto nello stesso momento, senza useEffect:
 * calcola il nuovo stato, lo salva e sposta la camera sulla vista
 * corrispondente con una transizione animata.
 */
import { useRef, useState } from "react"
import type { CameraControls } from "@react-three/drei"
import { Scena } from "./components/scena/Scena"
import { VISTE } from "./config/camera"
import { vaiAllaVista } from "./components/scena/regiaCamera"

export default function App() {
  const [armadioAperto, setArmadioAperto] = useState(false)
  const cameraRef = useRef<CameraControls>(null)

  const gestisciClickArmadio = () => {
    const aprire = !armadioAperto
    setArmadioAperto(aprire)
    vaiAllaVista(cameraRef.current, aprire ? VISTE.armadio : VISTE.panoramica)
  }

  return (
    <Scena
      armadioAperto={armadioAperto}
      onClickArmadio={gestisciClickArmadio}
      cameraRef={cameraRef}
    />
  )
}
