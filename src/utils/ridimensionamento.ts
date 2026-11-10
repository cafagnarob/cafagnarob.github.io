/*
 * Ridimensionamento della finestra
 * Quando lo schermo cambia forma, riadatta la vista attiva (riadatta).
 * Registrato una sola volta all'avvio (main.tsx), come le scorciatoie.
 *
 * - Attesa di ATTESA_MS dall'ultimo evento: durante un trascinamento
 *   della finestra gli eventi sono decine al secondo; si riadatta una
 *   volta sola, a movimento finito. Nel frattempo R3F ha già aggiornato
 *   le proporzioni della camera.
 * - Variazioni minime ignorate: su telefono la barra dell'indirizzo che
 *   compare e scompare cambia di poco l'altezza, e farebbe "saltare" la camera.
 */
import { store } from "../store/store"
import { riadatta } from "../store/azioniScena"
import { aspettoFinestra } from "../components/scena/adattamento"

const ATTESA_MS = 150
const VARIAZIONE_MINIMA = 0.03 // 3% delle proporzioni

export function attivaRiadattamento() {
  let timer: number | undefined
  let ultimoAspetto = aspettoFinestra()

  window.addEventListener("resize", () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      const aspetto = aspettoFinestra()
      if (Math.abs(aspetto - ultimoAspetto) / ultimoAspetto < VARIAZIONE_MINIMA)
        return
      ultimoAspetto = aspetto
      store.dispatch(riadatta())
    }, ATTESA_MS)
  })
}
