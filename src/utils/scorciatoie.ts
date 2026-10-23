/*
 * Scorciatoie da tastiera
 * Registrate una sola volta all'avvio (main.tsx), fuori da React:
 * parlano direttamente con lo store, quindi non servono useEffect.
 *
 * - Esc: esce dalla vista attiva (stesso thunk del pulsante "←").
 * - M: attiva / disattiva il muto.
 * Ignorate mentre si scrive in un campo di testo.
 */
import { store } from "../store/store"
import { esci } from "../store/azioniScena"
import { alternaMuto } from "../store/azioniAudio"

const staScrivendo = (bersaglio: EventTarget | null) =>
  bersaglio instanceof HTMLInputElement ||
  bersaglio instanceof HTMLTextAreaElement

export function attivaScorciatoie() {
  window.addEventListener("keydown", (evento) => {
    if (staScrivendo(evento.target)) return
    if (evento.key === "Escape") store.dispatch(esci())
    if (evento.key === "m" || evento.key === "M") store.dispatch(alternaMuto())
  })
}
