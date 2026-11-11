/*
 * useLuciStanza
 * A ogni fotogramma:
 * - Sfarfallio: un solo valore, applicato all'insegna E alla sua luce
 *   bakeata (muro, sedia), sincronizzato con il riflesso sull'armadio
 *   (stessa funzione, stesso orologio).
 * - Exit sotto il mouse (panoramica): il tubo si intensifica e con lui
 *   il bloom; la luce bakeata sul muro resta quella normale.
 * - Alone: nella panoramica il gruppo sotto il mouse si illumina
 *   (uniform evidenziazione), con un passaggio graduale.
 * - Invito: nella panoramica gli alone "respirano" anche senza hover,
 *   uno dopo l'altro (useInvito). L'hover vince sempre sul respiro.
 *   L'armadio ha il suo modello e lo stesso respiro in Armadio.tsx.
 */
import { useRef, type RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { ALONE_STANZA, INTENSIFICAZIONE_USCITA } from "../../config/stanza"
import { VELOCITA_EVIDENZIAZIONE } from "../../config/armadio"
import { intensitaNeon } from "../../utils/sfarfallio"
import { indiceInvito, intensitaRespiro } from "../../utils/respiro"
import { useAppSelector } from "../../store/hooks"

import { COLORE_NEON } from "./materialiSpeciali"
import type { MaterialiAnimati } from "./materialiStanza"
import type { Bersaglio } from "./useInterazioniStanza"
import { useInvito } from "../../hook/useInvito"

export function useLuciStanza(
  { insegna, luceNeon, evidenziabili }: MaterialiAnimati,
  sottoMouse: RefObject<Bersaglio | undefined>,
) {
  const vista = useAppSelector((s) => s.scena.vista)
  const tempoInvito = useInvito()
  const aloneUscita = useRef(0) // 0–1, smorzato come l'alone degli altri gruppi

  useFrame(({ clock }, delta) => {
    const fattore = 1 - Math.exp(-VELOCITA_EVIDENZIAZIONE * delta)
    const inPanoramica = vista === "panoramica"
    const invito = tempoInvito(clock.elapsedTime) // null = spento

    // Exit sotto il mouse: avvicinamento graduale a 1 (o a 0 uscendo)
    const versoUscita = inPanoramica && sottoMouse.current === "uscita" ? 1 : 0
    aloneUscita.current += (versoUscita - aloneUscita.current) * fattore

    // Sfarfallio del neon (+ intensificazione dell'Exit sul solo tubo)
    const intensita = intensitaNeon(clock.elapsedTime)
    insegna.color
      .copy(COLORE_NEON)
      .multiplyScalar(
        intensita * (1 + INTENSIFICAZIONE_USCITA * aloneUscita.current),
      )
    for (const materiale of luceNeon) {
      materiale.uniforms.intensitaNeon.value = intensita
    }

    // Alone: il massimo tra hover e respiro dell'invito
    let posizione = 0 // ripiego per i gruppi non elencati in INVITO.ORDINE
    for (const [gruppo, materiali] of evidenziabili) {
      const hover = inPanoramica && sottoMouse.current === gruppo ? 1 : 0
      const respiro =
        invito === null
          ? 0
          : intensitaRespiro(invito, indiceInvito(gruppo, posizione))
      const obiettivo = Math.max(hover, respiro) * ALONE_STANZA

      for (const materiale of materiali) {
        const u = materiale.uniforms.evidenziazione
        u.value += (obiettivo - u.value) * fattore
      }
      posizione++
    }
  })
}
