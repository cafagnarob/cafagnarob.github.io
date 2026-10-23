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
  LUCI_CITTA,
  SCOSTAMENTO_M,
  SFUMATURA_BORDI,
  VELOCITA_AUTO,
} from "../../config/fuoriFinestra"
import { registraLuminoso } from "../scena/oggettiLuminosi"

/* Una luce è accesa (1) o spenta (0) in un certo periodo del suo ciclo.
   Il risultato dipende solo da (luce, periodo): sempre uguale, senza
   memorizzare nulla. Verso la fine del periodo sfuma verso lo stato
   del periodo successivo. */
function accensione(indice: number, tempo: number, ciclo: number) {
  const periodo = Math.floor(tempo / ciclo)
  const stato = (p: number) =>
    casuale(indice * 1000 + p) < LUCI_CITTA.probabilitaAccesa ? 1 : 0
  const attuale = stato(periodo)
  const prossimo = stato(periodo + 1)
  const tempoAlCambio = ciclo - (tempo % ciclo)
  const miscela = THREE.MathUtils.smoothstep(
    LUCI_CITTA.durataCambio - tempoAlCambio,
    0,
    LUCI_CITTA.durataCambio,
  )
  return attuale + (prossimo - attuale) * miscela
}

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

/* Luci della città: posizione, dimensione, colore e ritmo fissi
   (pseudo-casuali da un seme, come le auto) */
const LUCI_FERME = Array.from({ length: LUCI_CITTA.numero }, (_, i) => {
  const { area, diametro, colori, intensita, ciclo } = LUCI_CITTA
  const tra = (min: number, max: number, seme: number) =>
    min + (max - min) * casuale(seme)
  return {
    x: tra(area.xMin, area.xMax, i + 200),
    y: tra(area.yMin, area.yMax, i + 300),
    diametro: tra(diametro.minimo, diametro.massimo, i + 400),
    colore: colori[Math.floor(casuale(i + 500) * colori.length)],
    intensita: tra(intensita.minima, intensita.massima, i + 600),
    ciclo: tra(ciclo.minimo, ciclo.massimo, i + 700),
    fase: casuale(i + 800) * Math.PI * 2,
  }
})

const INIZIO_LUCI_FERME = AUTO.length * 2
const NUMERO_LUCI = INIZIO_LUCI_FERME + LUCI_FERME.length + 1 // auto + città + lampeggiante
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
    luci.frustumCulled = false
    registraLuminoso(luci)
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

    // Luci della città: ferme, respirano piano, ogni tanto cambiano stato
    LUCI_FERME.forEach((luce, i) => {
      const respiro = 1 + LUCI_CITTA.respiro * Math.sin(t * 0.8 + luce.fase)
      const livello =
        luce.intensita * respiro * accensione(i, t + luce.fase, luce.ciclo)
      colore.setRGB(...luce.colore).multiplyScalar(livello)
      posiziona(INIZIO_LUCI_FERME + i, luce.x, luce.y, luce.diametro, colore)
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
