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
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"
import { COLORE_NEON, creaMaterialiSpeciali } from "./materialiSpeciali"
import { intensitaNeon } from "../../utils/sfarfallio"
import {
  CARTELLA_TEXTURE_STANZA,
  OGGETTI_BAKEATI,
  OGGETTI_SPECIALI,
  PERCORSO_MODELLO_STANZA,
} from "../../config/stanza"
import { registraVisteDaScena } from "../scena/viste"

/* three.js "pulisce" i nomi degli oggetti glTF: gli spazi diventano "_"
   e i punti vengono tolti ("neon insegna" → "neon_insegna",
   "screen.001" → "screen001"). Convertiamo i nomi della configurazione
   (scritti come in Blender) con la stessa funzione, così coincidono. */
const nomeGltf = (nomeBlender: string) =>
  THREE.PropertyBinding.sanitizeNodeName(nomeBlender)

const NOMI = {
  vetroFinestra: nomeGltf(OGGETTI_SPECIALI.vetroFinestra),
  vetroFoto: nomeGltf(OGGETTI_SPECIALI.vetroFoto),
  foto: nomeGltf(OGGETTI_SPECIALI.foto),
  neon: nomeGltf(OGGETTI_SPECIALI.neon),
  citta: nomeGltf(OGGETTI_SPECIALI.citta),
  schermi: OGGETTI_SPECIALI.schermi.map(nomeGltf),
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

  /* Assegna i materiali e restituisce quelli da animare */
  const { insegna, luceNeon } = useMemo(() => {
    Object.values(texture).forEach(preparaTextureBake)
    const speciali = creaMaterialiSpeciali(texture.citta)
    const luceNeon: THREE.ShaderMaterial[] = [] // materiali illuminati dall'insegna

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
        oggetto.material = materiale

        registraVisteDaScena(scene)

        return { insegna: speciali.neon, luceNeon }
      }

      // Oggetti speciali (nomi convertiti come fa three.js)
      if (nome === NOMI.vetroFinestra) oggetto.material = speciali.vetroFinestra
      else if (nome === NOMI.vetroFoto) oggetto.material = speciali.vetroFoto
      else if (nome === NOMI.foto) oggetto.material = speciali.foto
      else if (nome === NOMI.neon) oggetto.material = speciali.neon
      else if (nome === NOMI.citta) oggetto.material = speciali.citta
      else if (NOMI.schermi.includes(nome)) oggetto.material = speciali.schermo
    })

    return { insegna: speciali.neon, luceNeon }
  }, [scene, texture])

  /* Sfarfallio: un solo valore per fotogramma, per insegna e luce */
  useFrame(({ clock }) => {
    const intensita = intensitaNeon(clock.elapsedTime)
    insegna.color.copy(COLORE_NEON).multiplyScalar(intensita)
    for (const materiale of luceNeon) {
      materiale.uniforms.intensitaNeon.value = intensita
    }
  })

  return <primitive object={scene} />
}

useGLTF.preload(PERCORSO_MODELLO_STANZA)
useTexture.preload(Object.values(URL_TEXTURE))
