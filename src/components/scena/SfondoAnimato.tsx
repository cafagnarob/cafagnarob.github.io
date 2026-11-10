/*
 * SfondoAnimato
 * Il logo "noia" ripetuto dietro la stanza, che scorre lentissimo.
 * - Disegnato per primo (renderOrder molto basso) e senza profondità:
 *   tutto il resto della scena gli passa sopra
 * - frustumCulled = false: il piano non è "nella" scena per la camera,
 *   three.js non deve scartarlo pensando che sia fuori inquadratura
 * - useFrame: il tempo avanza con delta (non con l'orologio assoluto),
 *   così con prefers-reduced-motion basta non farlo avanzare
 * - le proporzioni dello schermo si aggiornano a ogni fotogramma: il
 *   ridimensionamento della finestra è gestito senza eventi
 * - sul telefono in verticale le righe sono di più (parole più piccole)
 */
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { creaMaterialeSfondo } from "../../materials/materialeSfondo"
import {
  COLORE_FONDO,
  COLORE_SCRITTA,
  PERCORSO_MASCHERA,
  PROPORZIONE_PAROLA,
  RIGHE_ORIZZONTALE,
  RIGHE_VERTICALE,
  VELOCITA,
} from "../../config/sfondo"

const movimentoRidotto = window.matchMedia("(prefers-reduced-motion: reduce)")

export function SfondoAnimato() {
  const maschera = useTexture(PERCORSO_MASCHERA)

  const materiale = useMemo(() => {
    maschera.wrapS = THREE.RepeatWrapping
    maschera.generateMipmaps = false
    maschera.minFilter = THREE.LinearFilter
    maschera.needsUpdate = true

    const m = creaMaterialeSfondo(maschera)
    m.uniforms.aspettoParola.value = PROPORZIONE_PAROLA
    m.uniforms.coloreFondo.value.set(COLORE_FONDO)
    m.uniforms.coloreScritta.value.set(COLORE_SCRITTA)
    return m
  }, [maschera])

  useFrame(({ size }, delta) => {
    const u = materiale.uniforms
    const aspetto = size.width / size.height
    u.aspettoSchermo.value = aspetto
    u.righe.value = aspetto < 1 ? RIGHE_VERTICALE : RIGHE_ORIZZONTALE
    if (!movimentoRidotto.matches) u.tempo.value += delta * VELOCITA
  })

  return (
    <mesh renderOrder={-1000} frustumCulled={false} material={materiale}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

useTexture.preload(PERCORSO_MASCHERA)
