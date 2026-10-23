/*
 * Fuori dalla finestra
 * Auto (coppie di fari / stop sulla strada) e luce lampeggiante in cima
 * a un grattacielo, disegnate come bokeh davanti all'immagine della città.
 *
 * - Il piano della città (centro, assi, dimensioni) si ricava dalla sua
 *   mesh con analizzaPiano: le posizioni in config sono frazioni
 *   dell'immagine, convertite qui in coordinate del mondo.
 * - Un solo InstancedMesh per tutte le luci: una chiamata di disegno.
 * - Le auto hanno velocità e partenze diverse ma FISSE (pseudo-casuali
 *   da un seme): il traffico è sempre vario, senza Math.random a ogni giro.
 * - useFrame aggiorna solo posizione e colore delle istanze.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA, OGGETTI_SPECIALI } from "../../config/stanza"
import { nomeGltf } from "../../utils/nomiGltf"
import { analizzaPiano } from "../../utils/piano"
import { vistaPer } from "../scena/viste"
import { creaMaterialeBokeh } from "../../materials/materialeBokeh"
import {
  AUTO_PER_CORSIA,
  CORSIE,
  DIAMETRO_LUCE_AUTO,
  DISTANZA_LUCI_AUTO,
  LAMPEGGIANTE,
  SCOSTAMENTO_M,
  SFUMATURA_BORDI,
  VELOCITA_AUTO,
} from "../../config/fuoriFinestra"

/* Numero pseudo-casuale stabile tra 0 e 1 a partire da un intero */
const casuale = (seme: number) => {
  const x = Math.sin(seme * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/* Auto: corsia, velocità e partenza fisse */
const AUTO = CORSIE.flatMap((corsia, c) =>
  Array.from({ length: AUTO_PER_CORSIA }, (_, i) => ({
    corsia,
    velocita:
      VELOCITA_AUTO.minima +
      (VELOCITA_AUTO.massima - VELOCITA_AUTO.minima) * casuale(c * 10 + i),
    partenza: casuale(c * 10 + i + 100),
  })),
)
const NUMERO_LUCI = AUTO.length * 2 + 1 // due per auto + il lampeggiante
const INDICE_LAMPEGGIANTE = NUMERO_LUCI - 1

/* Oggetti riutilizzati a ogni fotogramma */
const matrice = new THREE.Matrix4()
const posizione = new THREE.Vector3()
const colore = new THREE.Color()

export function FuoriFinestra() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA)

  const { luci, piano } = useMemo(() => {
    const citta = scene.getObjectByName(nomeGltf(OGGETTI_SPECIALI.citta))
    const vista = vistaPer("panoramica")
    const luci = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      creaMaterialeBokeh(),
      NUMERO_LUCI,
    )
    luci.frustumCulled = false // le istanze si muovono: il riquadro di partenza non vale
    if (!(citta instanceof THREE.Mesh) || !vista) {
      console.warn("Fuori finestra: immagine della città non trovata")
      return { luci, piano: null }
    }
    const piano = analizzaPiano(citta, new THREE.Vector3(...vista.posizione))
    // Orientamento comune: assi del piano (destra, alto, normale)
    const base = new THREE.Matrix4().makeBasis(
      piano.destra,
      piano.alto,
      piano.normale,
    )
    return { luci, piano: { ...piano, base } }
  }, [scene])

  const scala = new THREE.Vector3() // accanto agli altri oggetti riutilizzati

  const posiziona = (
    indice: number,
    x: number,
    y: number,
    diametro: number,
    rgb: THREE.Color,
  ) => {
    if (!piano) return
    // Punto dell'immagine (x, y), appena davanti alla sua superficie
    posizione
      .copy(piano.centro)
      .addScaledVector(piano.destra, (x - 0.5) * piano.larghezza)
      .addScaledVector(piano.alto, (y - 0.5) * piano.altezza)
      .addScaledVector(piano.normale, SCOSTAMENTO_M)
    // Orientata come il piano, grande "diametro" × altezza dell'immagine
    const lato = diametro * piano.altezza
    matrice
      .copy(piano.base)
      .scale(scala.set(lato, lato, 1))
      .setPosition(posizione)
    luci.setMatrixAt(indice, matrice)
    luci.setColorAt(indice, rgb)
  }

  useFrame(({ clock }) => {
    if (!piano) return
    const t = clock.elapsedTime

    // Auto: scorrono da un bordo all'altro, sfumando agli estremi
    AUTO.forEach(({ corsia, velocita, partenza }, i) => {
      const avanzamento = (partenza + t * velocita) % (1 + 2 * SFUMATURA_BORDI)
      let x = avanzamento - SFUMATURA_BORDI
      if (corsia.direzione < 0) x = 1 - x
      const visibilita =
        THREE.MathUtils.smoothstep(x, -SFUMATURA_BORDI, SFUMATURA_BORDI) *
        THREE.MathUtils.smoothstep(1 - x, -SFUMATURA_BORDI, SFUMATURA_BORDI)
      colore.setRGB(...corsia.colore).multiplyScalar(visibilita)
      const meta = DISTANZA_LUCI_AUTO / 2
      posiziona(i * 2, x - meta, corsia.y, DIAMETRO_LUCE_AUTO, colore)
      posiziona(i * 2 + 1, x + meta, corsia.y, DIAMETRO_LUCE_AUTO, colore)
    })

    // Lampeggiante: lampo breve ogni "periodo" secondi, con dissolvenza
    const fase = t % LAMPEGGIANTE.periodo
    const lampo = Math.sin(
      Math.PI * THREE.MathUtils.clamp(fase / LAMPEGGIANTE.durata, 0, 1),
    )
    colore.setRGB(...LAMPEGGIANTE.colore).multiplyScalar(lampo)
    posiziona(
      INDICE_LAMPEGGIANTE,
      LAMPEGGIANTE.x,
      LAMPEGGIANTE.y,
      LAMPEGGIANTE.diametro,
      colore,
    )

    luci.instanceMatrix.needsUpdate = true
    if (luci.instanceColor) luci.instanceColor.needsUpdate = true
  })

  return <primitive object={luci} />
}
