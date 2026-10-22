/*
 * Scena
 * Contenitore della scena 3D: Canvas (renderer + camera), controlli
 * della camera e armadio. Riceve da App lo stato dell'armadio e il
 * ref dei controlli della camera.
 *
 * - dpr={[1, 2]}: risoluzione adattiva, al massimo il doppio dei pixel.
 * - onCreated: tonemapping AgX, la stessa di Blender.
 * - CameraControls: solo ROTAZIONE (tasto sinistro / un dito), entro i
 *   limiti impostati da vaiAllaVista. Zoom, spostamento e gesti a due
 *   dita sono disattivati. smoothTime regola la morbidezza.
 * - collegaCamera: callback ref stabile (useCallback), chiamata una sola
 *   volta: salva l'istanza nel ref di App e posiziona la camera sulla
 *   vista iniziale, con i suoi limiti, senza animazione.
 */
import { Suspense, useCallback, type RefObject } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import CameraControlsImpl from "camera-controls"
import { Armadio } from "../armadio/Armadio"
import { VISTE } from "../../config/camera"
import { vaiAllaVista } from "./regiaCamera"
import type { Rettangolo } from "../../utils/rettangoloSchermo"

const { ACTION } = CameraControlsImpl

/* Comandi consentiti: solo rotazione */
const COMANDI_MOUSE = {
  left: ACTION.ROTATE,
  middle: ACTION.NONE,
  right: ACTION.NONE,
  wheel: ACTION.NONE,
}
const COMANDI_TOUCH = {
  one: ACTION.TOUCH_ROTATE,
  two: ACTION.NONE,
  three: ACTION.NONE,
}

type ScenaProps = {
  armadioAperto: boolean
  capoInIspezione: string | null
  ritornoCapo: boolean
  onApriArmadio: () => void
  onChiudiArmadio: () => void
  onSelezionaCapo: (idLavoro: string, rettangolo: Rettangolo) => void
  onRimettiCapo: () => void
  onRitornoCompletato: () => void
  cameraRef: RefObject<CameraControls | null>
}

export function Scena({
  armadioAperto,
  capoInIspezione,
  ritornoCapo,
  onApriArmadio,
  onSelezionaCapo,
  onRitornoCompletato,
  onRimettiCapo,
  onChiudiArmadio,
  cameraRef,
}: ScenaProps) {
  const collegaCamera = useCallback(
    (controlli: CameraControls | null) => {
      cameraRef.current = controlli
      vaiAllaVista(controlli, VISTE.panoramica, false)
    },
    [cameraRef],
  )

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping
      }}
    >
      <Suspense fallback={null}>
        <Armadio
          aperto={armadioAperto}
          capoInIspezione={capoInIspezione}
          ritornoCapo={ritornoCapo}
          onApri={onApriArmadio}
          onChiudi={onChiudiArmadio}
          onSelezionaCapo={onSelezionaCapo}
          onRimettiCapo={onRimettiCapo}
          onRitornoCompletato={onRitornoCompletato}
        />
      </Suspense>

      <CameraControls
        ref={collegaCamera}
        makeDefault
        mouseButtons={COMANDI_MOUSE}
        touches={COMANDI_TOUCH}
        smoothTime={0.5}
      />
    </Canvas>
  )
}
