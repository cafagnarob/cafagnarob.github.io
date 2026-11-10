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
import { COLORE_SFONDO, VISTE_PREDEFINITE } from "../../config/camera"
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
import { eTouch } from "../../utils/dispositivo"
import { Effetti } from "./Effetti"
import { adattaAlloSchermo } from "./adattamento"
import { lazy } from "react"
import { SfondoAnimato } from "./SfondoAnimato"

/* Caricato solo se serve: non finisce nel pacchetto del sito pubblicato */
const Perf = lazy(() =>
  import("r3f-perf").then((modulo) => ({ default: modulo.Perf })),
)

/* Pannello prestazioni: solo in sviluppo e con ?perf nell'indirizzo
   (es. http://192.168.1.23:5173/?perf), così non disturba il lavoro normale */
const MOSTRA_PRESTAZIONI =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has("perf")

/* Con il mouse la scena passa dal composer (sfocatura nella vista PC) e
   la tonemapping AgX la applica il composer; su touch niente effetti
   (troppo pesanti) e AgX la applica il renderer, come prima.
   Deciso una volta all'avvio: cambiare la tonemapping del renderer a
   metà ricompilerebbe tutti i materiali. */
const CON_EFFETTI = !eTouch()

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
  vaiAllaVista(
    controlli,
    adattaAlloSchermo(VISTE_PREDEFINITE.panoramica, "panoramica"),
    false,
  )
}

export function Scena() {
  const dispatch = useAppDispatch()
  const armadioAperto = useAppSelector((s) => s.scena.vista === "armadio")
  const capoInIspezione = useAppSelector((s) => s.scena.capoInIspezione)
  const ritornoCapo = useAppSelector((s) => s.scena.ritornoCapo)

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = CON_EFFETTI
          ? THREE.NoToneMapping
          : THREE.AgXToneMapping
      }}
    >
      {MOSTRA_PRESTAZIONI && <Perf position="top-left" />}

      {/* Sfondo opaco: il bloom che esce dalla stanza si somma a questo
          colore invece che a pixel trasparenti (che darebbero una velatura
          grigia). Stesso colore dello sfondo della pagina. */}
      <color attach="background" args={[COLORE_SFONDO]} />
      <Suspense fallback={null}>
        <SfondoAnimato />
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
        {CON_EFFETTI && <Effetti />}
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
