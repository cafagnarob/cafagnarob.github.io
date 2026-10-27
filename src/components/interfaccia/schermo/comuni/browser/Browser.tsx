/*
 * Browser
 * Finto browser che "visita" il sito di un progetto:
 * 1. si apre sulla home di Sonda (motore di ricerca inventato)
 * 2. l'indirizzo del progetto si digita nella casella di ricerca
 * 3. invio: la barra di caricamento corre
 * 4. compare la pagina del progetto e la barra mostra l'indirizzo
 *
 * La regia è tutta CSS: i tempi (tempi.ts) diventano variabili
 * (--inizio, --passo, --invio, --caricamento, --pagina) e ogni elemento
 * ha la sua animazione con il suo ritardo. Niente timer né stato:
 * chiudendo il browser le animazioni spariscono con lui; chi lo usa
 * mette key={progetto.id}, così un altro progetto riparte da capo.
 *
 * Fasi: .prima (ricerca) sparisce a --pagina, .dopo (sito) compare.
 * - variante "finestra" (desktop): scheda, pulsanti, indirizzo in alto
 * - variante "telefono": a tutto schermo, indirizzo in basso come
 *   Safari, con "‹" per tornare alla home
 */
import type { CSSProperties } from "react"
import type { Progetto } from "../../../../../data/progetti"
import { IconaProgetto } from "../IconaProgetto"
import { PaginaProgetto } from "../PaginaProgetto"
import { HomeSonda } from "./HomeSonda"
import { TEMPI, tempiDigitazione } from "./tempi"
import stili from "./Browser.module.css"

type Props = {
  progetto: Progetto
  variante: "finestra" | "telefono"
  onChiudi: () => void
}

export function Browser({ progetto, variante, onChiudi }: Props) {
  const t = tempiDigitazione(progetto.indirizzo.length)
  const regia = {
    "--inizio": `${t.inizio}ms`,
    "--passo": `${TEMPI.passo}ms`,
    "--invio": `${t.invio}ms`,
    "--caricamento": `${TEMPI.caricamento}ms`,
    "--pagina": `${t.pagina}ms`,
  } as CSSProperties

  return (
    <section
      className={`${stili.browser} ${stili[variante]}`}
      style={regia}
      aria-label={`Browser: ${progetto.nome}`}
    >
      {variante === "finestra" && (
        <header className={stili.titolo}>
          <span className={stili.scheda}>
            <span className={stili.strati}>
              <span
                className={`${stili.prima} ${stili.marchio}`}
                aria-hidden="true"
              >
                s
              </span>
              <IconaProgetto
                progetto={progetto}
                className={`${stili.dopo} ${stili.favicon}`}
              />
            </span>
            <span className={stili.strati}>
              <span className={stili.prima}>Sonda</span>
              <span className={stili.dopo}>{progetto.nome}</span>
            </span>
          </span>
          <span className={stili.comandi}>
            <span aria-hidden="true">–</span>
            <span aria-hidden="true">□</span>
            <button
              type="button"
              className={stili.chiudi}
              onClick={onChiudi}
              aria-label="Chiudi il browser"
            >
              ✕
            </button>
          </span>
        </header>
      )}

      <div className={stili.barraIndirizzo}>
        {variante === "telefono" && (
          <button
            type="button"
            className={stili.indietro}
            onClick={onChiudi}
            aria-label="Torna alla home"
          >
            ‹
          </button>
        )}
        <span className={`${stili.indirizzo} ${stili.strati}`}>
          <span className={`${stili.prima} ${stili.segnaposto}`}>
            Cerca o digita un indirizzo
          </span>
          <span className={stili.dopo}>
            <svg
              className={stili.lucchetto}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z" />
            </svg>
            {progetto.indirizzo}
          </span>
        </span>
      </div>

      <div className={stili.caricamento} aria-hidden="true" />

      <div className={stili.vista}>
        <HomeSonda testo={progetto.indirizzo} className={stili.prima} />
        <div className={`${stili.dopo} ${stili.pagina}`}>
          <PaginaProgetto progetto={progetto} />
        </div>
      </div>
    </section>
  )
}
