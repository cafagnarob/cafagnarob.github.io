/*
 * useLuciStanza
 * A ogni fotogramma:
 * - Sfarfallio: un solo valore, applicato all'insegna E alla sua luce
 *   bakeata (muro, sedia), sincronizzato con il riflesso sull'armadio
 *   (stessa funzione, stesso orologio).
 * - Alone: nella panoramica il gruppo sotto il mouse si illumina
 *   (uniform evidenziazione), con un passaggio graduale.
 */
import type { RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import type { NomeVista } from "../../config/camera"
import { ALONE_STANZA } from "../../config/stanza"
import { VELOCITA_EVIDENZIAZIONE } from "../../config/armadio"
import { intensitaNeon } from "../../utils/sfarfallio"
import { useAppSelector } from "../../store/hooks"
import { COLORE_NEON } from "./materialiSpeciali"
import type { MaterialiAnimati } from "./materialiStanza"

export function useLuciStanza(
  { insegna, luceNeon, evidenziabili }: MaterialiAnimati,
  sottoMouse: RefObject<NomeVista | undefined>,
) {
  const vista = useAppSelector((s) => s.scena.vista)

  useFrame(({ clock }, delta) => {
    // Sfarfallio del neon
    const intensita = intensitaNeon(clock.elapsedTime)
    insegna.color.copy(COLORE_NEON).multiplyScalar(intensita)
    for (const materiale of luceNeon) {
      materiale.uniforms.intensitaNeon.value = intensita
    }

    // Alone sul gruppo sotto il mouse (solo nella panoramica)
    const fattore = 1 - Math.exp(-VELOCITA_EVIDENZIAZIONE * delta)
    for (const [gruppo, materiali] of evidenziabili) {
      const obiettivo =
        vista === "panoramica" && sottoMouse.current === gruppo
          ? ALONE_STANZA
          : 0
      for (const materiale of materiali) {
        const u = materiale.uniforms.evidenziazione
        u.value += (obiettivo - u.value) * fattore
      }
    }
  })
}
