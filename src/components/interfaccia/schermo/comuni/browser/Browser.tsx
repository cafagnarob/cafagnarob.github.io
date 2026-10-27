/*
 * Browser
 * Finto browser che "visita" il sito di un progetto:
 * 1. si apre sulla home di Sonda (motore di ricerca inventato)
 * 2. l'indirizzo del progetto si digita nella casella di ricerca
 * 3. invio: la barra di caricamento corre
 * 4. compare il contenuto (contenutoDi) e la barra mostra l'indirizzo:
 *    - README del progetto, con il pulsante che avvia il gioco
 *    - oppure il sito vero in un iframe (incorpora)
 *    - oppure la pagina del progetto
 *
 * La regia è tutta CSS: i tempi (tempi.ts) diventano variabili
 * (--inizio, --passo, --invio, --caricamento, --pagina) e ogni elemento
 * ha la sua animazione con il suo ritardo. Niente timer né stato:
 * chiudendo il browser le animazioni spariscono con lui; chi lo usa
 * mette key={progetto.id}, così un altro progetto riparte da capo.
 *
 * Fasi: .prima (ricerca) sparisce a --pagina, .dopo (sito) compare.
 * - variante "finestra" (desktop): schede, pulsanti, indirizzo in alto
 * - variante "telefono": a tutto schermo, indirizzo in basso come
 *   Safari, con "‹" per tornare alla home
 *
 * Se il progetto ha link.codice: una seconda scheda (finestra) o un
 * pulsante (telefono) apre il repository su GitHub in una nuova scheda.
 * Non dentro il browser finto: GitHub vieta di essere mostrato in un
 * iframe (X-Frame-Options).
 */
import { lazy, Suspense, type CSSProperties } from "react"
import type { Progetto } from "../../../../../data/progetti"
import { IconaProgetto } from "../IconaProgetto"
import { PaginaProgetto } from "../PaginaProgetto"
import { SitoIncorporato } from "../SitoIncorporato"
import { HomeSonda } from "./HomeSonda"
import { TEMPI, tempiDigitazione } from "./tempi"
import stili from "./Browser.module.css"

/* Caricata solo al primo progetto con README: le librerie del Markdown
   restano fuori dal caricamento iniziale del sito */
const PaginaReadme = lazy(() => import("../readme/PaginaReadme"))

/* Cosa mostra il browser dopo il caricamento:
   README (se c'è) → sito incorporato (se c'è) → pagina del progetto.
   Sul telefono i giochi del README non si avviano (solo da computer). */
function contenutoDi(progetto: Progetto, variante: Props["variante"]) {
  if (progetto.readme) {
    return (
      <Suspense fallback={null}>
        <PaginaReadme progetto={progetto} giocabile={variante !== "telefono"} />
      </Suspense>
    )
  }
  if (progetto.incorpora) {
    return <SitoIncorporato src={progetto.incorpora} titolo={progetto.nome} />
  }
  return <PaginaProgetto progetto={progetto} />
}

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
          <span className={stili.schede}>
            {/* Scheda del sito: Sonda → nome del progetto */}
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

            {/* Scheda GitHub: si apre fuori, in una nuova scheda */}
            {progetto.link?.codice && (
              <a
                className={`${stili.scheda} ${stili.schedaEsterna}`}
                href={progetto.link.codice}
                target="_blank"
                rel="noopener noreferrer"
                title="Apre il repository su GitHub in una nuova scheda"
              >
                <IconaCodice className={stili.favicon} />
                <span>GitHub</span>
                <IconaUscita className={stili.uscita} />
              </a>
            )}
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

        {/* Pillola: SOLO i due strati, segnaposto e indirizzo */}
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

        {/* Fuori dalla pillola: flex + gap di barraIndirizzo lo mettono a destra */}
        {variante === "telefono" && progetto.link?.codice && (
          <a
            className={stili.pulsanteCodice}
            href={progetto.link.codice}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apri il codice su GitHub"
          >
            <IconaCodice />
          </a>
        )}
      </div>

      <div className={stili.caricamento} aria-hidden="true" />

      <div className={stili.vista}>
        <HomeSonda testo={progetto.indirizzo} className={stili.prima} />
        <div className={`${stili.dopo} ${stili.pagina}`}>
          {contenutoDi(progetto, variante)}
        </div>
      </div>
    </section>
  )
}

/* "</>": codice sorgente */
function IconaCodice({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  )
}

/* Freccia in uscita: "si apre fuori da qui" */
function IconaUscita({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}
