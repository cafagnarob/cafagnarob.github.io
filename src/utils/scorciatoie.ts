/*
 * Scorciatoie da tastiera
 * Registrate una sola volta all'avvio (main.tsx), fuori da React:
 * parlano direttamente con lo store, quindi non servono useEffect.
 *
 * - Esc: esce dalla vista attiva (stesso thunk del pulsante "←").
 */
import { store } from "../store/store"
import { esci } from "../store/azioniScena"

export function attivaScorciatoie() {
  window.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") store.dispatch(esci())
  })
}
