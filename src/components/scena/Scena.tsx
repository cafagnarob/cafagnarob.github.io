/*
 * Scena
 * Contenitore della scena 3D: crea il Canvas (renderer + camera),
 * le luci e i controlli, e carica l'armadio.
 *
 * - dpr={[1, 2]}: la risoluzione si adatta allo schermo ma non
 *   supera il doppio dei pixel. Sugli smartphone (che possono
 *   arrivare a 3x) evita di renderizzare il triplo dei pixel.
 * - Le luci sono TEMPORANEE: servono solo per vedere il modello
 *   grigio. Con i PNG bakeati la luce sarà già nelle texture.
 * - OrbitControls senza limiti, solo per controllare il modello
 *   da ogni lato. Funziona anche con il touch su mobile.
 *   Più avanti lo sostituiremo con il movimento limitato.
 * - Il target (-2.42, 1, 0) è il centro dell'armadio convertito
 *   dagli assi di Blender (Z verso l'alto) a quelli di three.js
 *   (Y verso l'alto).
 */
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Armadio } from "../armadio/Armadio"

const CENTRO_ARMADIO: [number, number, number] = [-2.42, 1, 0]

export function Scena() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [1, 1.5, 1.5], fov: 40 }}>
      {/* Luci temporanee per il test con modello grigio */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />

      {/* Suspense: mostra "niente" finché il modello non è caricato */}
      <Suspense fallback={null}>
        <Armadio />
      </Suspense>

      <OrbitControls target={CENTRO_ARMADIO} makeDefault />
    </Canvas>
  )
}
