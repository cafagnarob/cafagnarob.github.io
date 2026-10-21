/*
 * Scena
 * Contenitore della scena 3D: Canvas (renderer + camera), controlli
 * della camera e armadio. Riceve da App lo stato dell'armadio e il
 * ref dei controlli della camera.
 *
 * - dpr={[1, 2]}: risoluzione adattiva, al massimo il doppio dei pixel.
 * - onCreated: tonemapping AgX, la stessa di Blender. Niente luci:
 *   l'illuminazione è nelle texture bakeate.
 * - CameraControls: rotazione con mouse/touch (per ora senza limiti)
 *   e transizioni animate tra le viste (comandate da App).
 * - collegaCamera: "callback ref" stabile (useCallback). Viene chiamata
 *   una sola volta quando CameraControls è pronto: salva l'istanza nel
 *   ref di App e posiziona la camera sulla vista iniziale, senza
 *   animazione. Essendo stabile, i re-render non la richiamano e
 *   la camera non "salta".
 */
import { Suspense, useCallback, type RefObject } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import { Armadio } from "../armadio/Armadio"
import { VISTE } from "../../config/camera"

type ScenaProps = {
  armadioAperto: boolean
  onClickArmadio: () => void
  cameraRef: RefObject<CameraControls | null>
}

export function Scena({
  armadioAperto,
  onClickArmadio,
  cameraRef,
}: ScenaProps) {
  const collegaCamera = useCallback(
    (controlli: CameraControls | null) => {
      cameraRef.current = controlli
      const { posizione, obiettivo } = VISTE.panoramica
      controlli?.setLookAt(...posizione, ...obiettivo, false)
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
        <Armadio aperto={armadioAperto} onClick={onClickArmadio} />
      </Suspense>

      <CameraControls ref={collegaCamera} makeDefault />
    </Canvas>
  )
}
