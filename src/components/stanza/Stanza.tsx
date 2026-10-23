/*
 * Stanza
 * Carica stanza.glb e assegna i materiali a ogni oggetto:
 * - gruppi bakeati → materiale bakeato con il PNG base (e il PNG neon
 *   se in config c'è neon: true) e il moltiplicatore della loro esposizione
 * - oggetti speciali → materiali provvisori (materialiSpeciali.ts)
 *
 * - useMemo assegna i materiali una sola volta, prima del primo
 *   disegno (niente fotogramma grigio).
 * - useFrame calcola lo sfarfallio una volta per fotogramma e lo applica
 *   all'insegna E alla sua luce bakeata (muro, sedia): si muovono insieme.
 *   Usa la stessa funzione e lo stesso orologio dell'armadio, quindi anche
 *   il riflesso sul fianco dell'armadio resta sincronizzato.
 * - I segnaposto (vista_…, guarda_…, fumo_tazza) sono vuoti: non si
 *   vedono, li leggeremo più avanti per le viste della camera e il fumo.
 *
 *  * - registraVisteDaScena legge gli empty vista_… / guarda_… (viste della
 *   camera). fumo_tazza resta un segnaposto per il fumo, più avanti.
 * - Oggetti cliccabili (config OGGETTI_CLICCABILI): nella panoramica il
 *   gruppo sotto il mouse si illumina (uniform evidenziazione, smorzata
 *   in useFrame) e il clic porta alla sua vista con il thunk vaiA.
 *   Conta solo l'oggetto PIÙ VICINO alla camera (vistaColpita).
 */
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"
import { COLORE_NEON, creaMaterialiSpeciali } from "./materialiSpeciali"
import { intensitaNeon } from "../../utils/sfarfallio"
import {
  ALONE_STANZA,
  CARTELLA_TEXTURE_STANZA,
  OGGETTI_BAKEATI,
  OGGETTI_CLICCABILI,
  OGGETTI_SPECIALI,
  PERCORSO_MODELLO_STANZA,
} from "../../config/stanza"
import { registraVisteDaScena } from "../scena/viste"
import { nomeGltf } from "../../utils/nomiGltf"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import type { NomeVista } from "../../config/camera"
import { VELOCITA_EVIDENZIAZIONE } from "../../config/armadio"
import { vaiA } from "../../store/azioniScena"

const NOMI = {
  vetroFinestra: nomeGltf(OGGETTI_SPECIALI.vetroFinestra),
  vetroFoto: nomeGltf(OGGETTI_SPECIALI.vetroFoto),
  foto: nomeGltf(OGGETTI_SPECIALI.foto),
  neon: nomeGltf(OGGETTI_SPECIALI.neon),
  citta: nomeGltf(OGGETTI_SPECIALI.citta),
  schermi: OGGETTI_SPECIALI.schermi.map(nomeGltf),
}

/* Nome glTF → vista che apre (es. "screen001" → "pc") */
const VISTA_DI = new Map(
  Object.entries(OGGETTI_CLICCABILI).map(([nome, vista]) => [
    nomeGltf(nome),
    vista,
  ]),
)

/* Vista dell'oggetto colpito, ma solo se è il PIÙ VICINO alla camera:
   R3F chiama l'handler per ogni oggetto attraversato dal raggio, anche
   quelli dietro; così un muro davanti non lascia passare il clic. */
function vistaColpita(evento: ThreeEvent<PointerEvent | MouseEvent>) {
  if (evento.intersections[0]?.object !== evento.object) return undefined
  return VISTA_DI.get(evento.object.name)
}

/* Chiave della texture neon di un gruppo (es. "stanza_neon") */
const chiaveNeon = (nome: string) => `${nome}_neon`

/* URL dei PNG: base per ogni gruppo, neon solo dove serve, più la città */
const URL_TEXTURE: Record<string, string> = {
  citta: `${CARTELLA_TEXTURE_STANZA}/citta_notte.png`,
}
for (const [nome, opzioni] of Object.entries(OGGETTI_BAKEATI)) {
  URL_TEXTURE[nome] = `${CARTELLA_TEXTURE_STANZA}/${nome}_base.png`
  if (opzioni.neon) {
    URL_TEXTURE[chiaveNeon(nome)] =
      `${CARTELLA_TEXTURE_STANZA}/${nome}_neon.png`
  }
}

export function Stanza() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA)
  const texture = useTexture(URL_TEXTURE)

  const dispatch = useAppDispatch()
  const vista = useAppSelector((s) => s.scena.vista)
  const sottoMouse = useRef<NomeVista | undefined>(undefined)

  /* Assegna i materiali e restituisce quelli da animare */
  const { insegna, luceNeon, evidenziabili } = useMemo(() => {
    Object.values(texture).forEach(preparaTextureBake)
    const speciali = creaMaterialiSpeciali(texture.citta)
    const luceNeon: THREE.ShaderMaterial[] = [] // materiali illuminati dall'insegna
    const evidenziabili = new Map<NomeVista, THREE.ShaderMaterial[]>()

    scene.traverse((oggetto) => {
      if (!(oggetto instanceof THREE.Mesh)) return
      const nome = oggetto.name

      // Gruppi bakeati: moltiplicatore = 2^(-esposizione)
      const opzioni = OGGETTI_BAKEATI[nome]
      if (opzioni) {
        const materiale = creaMaterialeBake(
          {
            base: texture[nome],
            neon: opzioni.neon ? texture[chiaveNeon(nome)] : undefined,
          },
          2 ** -opzioni.esposizione,
        )
        if (opzioni.doppiaFaccia) materiale.side = THREE.DoubleSide
        if (opzioni.neon) luceNeon.push(materiale)
        const vistaOggetto = VISTA_DI.get(nome)
        if (vistaOggetto) {
          const lista = evidenziabili.get(vistaOggetto) ?? []
          lista.push(materiale)
          evidenziabili.set(vistaOggetto, lista)
        }
        oggetto.material = materiale
        oggetto.material = materiale
        return
      }

      // Oggetti speciali (nomi convertiti come fa three.js)
      if (nome === NOMI.vetroFinestra) oggetto.material = speciali.vetroFinestra
      else if (nome === NOMI.vetroFoto) oggetto.material = speciali.vetroFoto
      else if (nome === NOMI.foto) oggetto.material = speciali.foto
      else if (nome === NOMI.neon) oggetto.material = speciali.neon
      else if (nome === NOMI.citta) oggetto.material = speciali.citta
      else if (NOMI.schermi.includes(nome)) oggetto.material = speciali.schermo
    })

    registraVisteDaScena(scene)

    return { insegna: speciali.neon, luceNeon, evidenziabili }
  }, [scene, texture])

  /* Sfarfallio: un solo valore per fotogramma, per insegna e luce */
  useFrame(({ clock }, delta) => {
    const intensita = intensitaNeon(clock.elapsedTime)
    insegna.color.copy(COLORE_NEON).multiplyScalar(intensita)
    for (const materiale of luceNeon) {
      materiale.uniforms.intensitaNeon.value = intensita
    }

    // Alone: solo nella panoramica, sul gruppo sotto il mouse
    const fattore = 1 - Math.exp(-VELOCITA_EVIDENZIAZIONE * delta)
    for (const [vistaGruppo, materiali] of evidenziabili) {
      const obiettivo =
        vista === "panoramica" && sottoMouse.current === vistaGruppo
          ? ALONE_STANZA
          : 0
      for (const materiale of materiali) {
        const u = materiale.uniforms.evidenziazione
        u.value += (obiettivo - u.value) * fattore
      }
    }
  })

  return (
    <primitive
      object={scene}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        sottoMouse.current = vistaColpita(e)
        document.body.style.cursor =
          vista === "panoramica" && sottoMouse.current ? "pointer" : ""
      }}
      onPointerOut={() => {
        sottoMouse.current = undefined
        document.body.style.cursor = ""
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (vista !== "panoramica") return
        const destinazione = vistaColpita(e)
        if (!destinazione) return
        e.stopPropagation()
        sottoMouse.current = undefined
        dispatch(vaiA(destinazione))
      }}
    />
  )
}

useGLTF.preload(PERCORSO_MODELLO_STANZA)
useTexture.preload(Object.values(URL_TEXTURE))
