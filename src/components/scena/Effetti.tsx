/*
 * Effetti di post-produzione (solo con il mouse, non su touch)
 * La scena viene disegnata in un'immagine intermedia ed elaborata:
 *   1. DepthOfField: a fuoco il centro dello schermo del PC, il resto
 *      sfocato in base alla distanza. La sfocatura (bokehScale) sale da
 *      0 nella vista del PC e torna a 0 uscendo, in modo graduale.
 *   2. ToneMapping AgX: la stessa del renderer, spostata qui perché
 *      three.js la applica solo disegnando direttamente sullo schermo.
 *
 * - Lo stato si legge con store.getState() dentro useFrame: nessun
 *   re-render del componente, che altrimenti riapplicherebbe le props
 *   (bokehScale tornerebbe a 0).
 * - Il punto a fuoco si calcola al primo fotogramma utile: lo schermo
 *   viene registrato da Stanza quando il modello è caricato.
 */
import { useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import {
  DepthOfField,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing"
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing"
import { store } from "../../store/store"
import { meshSchermo } from "./schermi"
import {
  PROFONDITA_A_FUOCO_M,
  SCALA_BOKEH,
  SCHERMO_A_FUOCO,
  VELOCITA_SFOCATURA,
  VISTA_SFOCATA,
} from "../../config/sfocatura"

export function Effetti() {
  const profondita = useRef<DepthOfFieldEffect>(null)
  const puntoAFuoco = useRef<THREE.Vector3 | null>(null)

  useFrame((_, delta) => {
    const effetto = profondita.current
    if (!effetto) return

    // Primo fotogramma utile: centro dello schermo del PC
    if (!puntoAFuoco.current) {
      const schermo = meshSchermo(SCHERMO_A_FUOCO)
      if (!schermo) return
      puntoAFuoco.current = new THREE.Box3()
        .setFromObject(schermo)
        .getCenter(new THREE.Vector3())
      effetto.target = puntoAFuoco.current
    }

    // Sfocatura solo nella vista del PC (non a schermo acceso: lo copre tutto)
    const { vista, schermo } = store.getState().scena
    const obiettivo =
      vista === VISTA_SFOCATA && !schermo?.acceso ? SCALA_BOKEH : 0
    effetto.bokehScale +=
      (obiettivo - effetto.bokehScale) *
      (1 - Math.exp(-VELOCITA_SFOCATURA * delta))
  })

  return (
    <EffectComposer>
      <DepthOfField
        ref={profondita}
        focusRange={PROFONDITA_A_FUOCO_M}
        bokehScale={0}
      />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  )
}
