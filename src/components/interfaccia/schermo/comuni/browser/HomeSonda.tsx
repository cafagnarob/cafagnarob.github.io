/*
 * Home di Sonda
 * Pagina iniziale del motore di ricerca (inventato, a tema spazio come
 * lo sfondo): logo, casella di ricerca dove l'indirizzo si digita da
 * solo, pulsante di invio che "si preme" a --invio.
 * Il segnaposto sparisce quando inizia la digitazione (--inizio).
 * className: il Browser passa la sua classe di fase (.prima).
 */
import { TestoDigitato } from "./TestoDigitato"
import stili from "./HomeSonda.module.css"

type Props = { testo: string; className?: string }

export function HomeSonda({ testo, className = "" }: Props) {
  return (
    <div className={`${stili.home} ${className}`}>
      <p className={stili.logo} aria-hidden="true">
        sonda
      </p>
      <div className={stili.ricerca}>
        <svg
          className={stili.lente}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className={stili.campo}>
          <span className={stili.segnaposto}>Cerca o digita un indirizzo</span>
          <TestoDigitato testo={testo} />
        </span>
        <span className={stili.invio} aria-hidden="true">
          →
        </span>
      </div>
    </div>
  )
}
