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
import { registraVisteDaScena, vistaPerDispositivo } from "../scena/viste"
import { nomeGltf } from "../../utils/nomiGltf"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import type { NomeVista } from "../../config/camera"
import { VELOCITA_EVIDENZIAZIONE } from "../../config/armadio"
import { accendiSchermo, esci, vaiA } from "../../store/azioniScena"
import { SOGLIA_TRASCINAMENTO_PX } from "../../config/ispezione"
import { registraSchermi, schermoDi } from "../scena/schermi"

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

/* Vista dell'oggetto PIÙ VICINO alla camera (o undefined).
   R3F chiama l'handler una volta per ogni oggetto attraversato dal
   raggio (dal più vicino al più lontano): leggendo sempre il primo di
   e.intersections, tutte le chiamate danno lo stesso risultato e
   l'ultima non sovrascrive la prima. Se il più vicino è l'armadio
   (che non è nella mappa) il risultato è undefined: niente alone. */
function vistaColpita(evento: ThreeEvent<PointerEvent | MouseEvent>) {
  const primo = evento.intersections[0]?.object
  return primo ? VISTA_DI.get(primo.name) : undefined
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
    registraSchermi(scene)

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
        // Trascinamento per ruotare la camera: non è un clic
        if (e.delta > SOGLIA_TRASCINAMENTO_PX) return
        // Conta solo l'oggetto più vicino (anche l'armadio, che ha i suoi clic)
        if (e.intersections[0]?.object !== e.object) return

        const colpita = vistaColpita(e)

        // Panoramica: clic su un oggetto cliccabile → la sua vista
        if (vista === "panoramica") {
          if (!colpita) return
          e.stopPropagation()
          sottoMouse.current = undefined
          dispatch(vaiA(colpita))
          return
        }

        // In una vista: clic sull'oggetto stesso
        if (colpita && vistaPerDispositivo(colpita) === vista) {
          // Lo schermo interattivo di QUESTA vista → si accende
          if (schermoDi(e.object.name) === vista) {
            e.stopPropagation()
            dispatch(accendiSchermo(vista))
          }
          return
        }

        // Clic su qualsiasi altra cosa della stanza → esci
        e.stopPropagation()
        dispatch(esci())
      }}
    />
  )
}

useGLTF.preload(PERCORSO_MODELLO_STANZA)
useTexture.preload(Object.values(URL_TEXTURE))
