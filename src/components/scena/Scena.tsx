/*
 * Scena
 * Contenitore della scena 3D: Canvas (renderer + camera), controlli
 * della camera, stanza e armadio. Legge lo stato dallo store Redux e lo
 * passa all'armadio; i clic diventano azioni (thunk di azioniScena.ts).
 *
 * - dpr={[1, 2]}: risoluzione adattiva, al massimo il doppio dei pixel.
 * - onCreated: tonemapping AgX, la stessa di Blender.
 * - CameraControls: solo ROTAZIONE (tasto sinistro / un dito), entro i
 *   limiti impostati da vaiAllaVista. Zoom, spostamento e gesti a due
 *   dita sono disattivati. smoothTime regola la morbidezza.
 * - collegaCamera: callback ref definita fuori dal componente (quindi
 *   sempre la stessa funzione): registra i controlli per i thunk e
 *   posiziona la camera sulla vista iniziale, senza animazione.
 */
import { Suspense } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import CameraControlsImpl from "camera-controls"
import { Armadio } from "../armadio/Armadio"
import { Stanza } from "../stanza/Stanza"
import { VISTE } from "../../config/camera"
import { vaiAllaVista } from "./regiaCamera"
import { registraControlliCamera } from "./controlliCamera"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  apriArmadio,
  chiudiArmadio,
  completaRitornoCapo,
  rimettiCapo,
  selezionaCapo,
} from "../../store/azioniScena"

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

/* Chiamata al montaggio (istanza) e allo smontaggio (null) */
function collegaCamera(controlli: CameraControls | null) {
  registraControlliCamera(controlli)
  vaiAllaVista(controlli, VISTE.panoramica, false)
}

export function Scena() {
  const dispatch = useAppDispatch()
  const armadioAperto = useAppSelector((s) => s.scena.armadioAperto)
  const capoInIspezione = useAppSelector((s) => s.scena.capoInIspezione)
  const ritornoCapo = useAppSelector((s) => s.scena.ritornoCapo)

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping
      }}
    >
      <Suspense fallback={null}>
        <Stanza />
        <Armadio
          aperto={armadioAperto}
          capoInIspezione={capoInIspezione}
          ritornoCapo={ritornoCapo}
          onApri={() => dispatch(apriArmadio())}
          onChiudi={() => dispatch(chiudiArmadio())}
          onSelezionaCapo={(id, rettangolo) =>
            dispatch(selezionaCapo(id, rettangolo))
          }
          onRimettiCapo={() => dispatch(rimettiCapo())}
          onRitornoCompletato={() => dispatch(completaRitornoCapo())}
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
