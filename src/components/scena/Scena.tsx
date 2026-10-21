/*
 * Scena
 * Contenitore della scena 3D: Canvas (renderer + camera), controlli
 * e armadio.
 *
 * - dpr={[1, 2]}: risoluzione adattiva, al massimo il doppio dei
 *   pixel (evita il triplo su smartphone ad alta densità).
 * - onCreated: imposta la tonemapping AgX sul renderer, la stessa
 *   usata in Blender, così i colori corrispondono al render.
 *   Non servono luci: tutta l'illuminazione è nelle texture bakeate.
 * - OrbitControls senza limiti: temporaneo, per controllare il
 *   modello da ogni lato (funziona anche con il touch).
 * - Il target è il centro dell'armadio convertito dagli assi di
 *   Blender (Z verso l'alto) a quelli di three.js (Y verso l'alto).
 */
import { Suspense } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Armadio } from "../armadio/Armadio"

const CENTRO_ARMADIO: [number, number, number] = [-2.42, 1, 0]

type ScenaProps = {
  armadioAperto: boolean
  onClickArmadio: () => void
}

export function Scena({ armadioAperto, onClickArmadio }: ScenaProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [1, 1.5, 1.5], fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping
      }}
    >
      <Suspense fallback={null}>
        <Armadio aperto={armadioAperto} onClick={onClickArmadio} />
      </Suspense>

      <OrbitControls target={CENTRO_ARMADIO} makeDefault />
    </Canvas>
  )
}
