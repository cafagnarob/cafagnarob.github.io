/*
 * Pulsante indietro
 * Freccia in alto a sinistra per uscire dalla vista attiva sugli
 * schermi touch (dove non c'è Esc e il clic "fuori" è poco intuitivo).
 *
 * - Visibile solo fuori dalla panoramica, senza capo in ispezione e a
 *   schermo spento: a schermo acceso l'interfaccia ha i suoi comandi
 *   (Spegni sul desktop, barra Home sul telefono).
 * - Il CSS lo nasconde sui dispositivi con mouse (hover + puntatore
 *   preciso): lì bastano Esc e il clic fuori dall'oggetto.
 * - Rispetta le aree sicure dei telefoni (notch) con env(safe-area-inset-*).
 */
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { esci } from "../../store/azioniScena"
import stili from "./PulsanteIndietro.module.css"

export function PulsanteIndietro() {
  const dispatch = useAppDispatch()
  const visibile = useAppSelector(
    (s) =>
      s.scena.vista !== "panoramica" &&
      s.scena.capoInIspezione === null &&
      !s.scena.schermo?.acceso,
  )

  if (!visibile) return null

  return (
    <button
      type="button"
      className={stili.pulsante}
      aria-label="Torna alla stanza"
      onClick={() => dispatch(esci())}
    >
      ←
    </button>
  )
}
