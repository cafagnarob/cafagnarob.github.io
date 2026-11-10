/*
 * Finestra Audio Panel
 * Il caso studio del pannello audio, impaginato come una presentazione
 * di prodotto: otto sezioni a tutta altezza, chiare e scure alternate.
 *
 * - Testata sovrapposta: titolo, menu delle sezioni, chiudi. Usa
 *   mix-blend-mode: difference, così resta leggibile sia sul chiaro sia
 *   sullo scuro senza cambiare colore a mano.
 * - Indicatore "03 / 08" a lato: segue lo scroll. Lo calcoliamo in
 *   onScroll (nessun useEffect): la sezione attiva è l'ultima il cui
 *   bordo superiore ha superato il 40% dell'altezza visibile.
 * - "Provalo nella stanza": chiude la finestra ed esce dallo schermo,
 *   così si vede il pannello vero in basso a destra.
 */
import { useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { chiudiAudioPanel } from "../../../store/sliceAudioPanel"
import { esci } from "../../../store/azioniScena"
import { SEZIONI_AUDIO_PANEL, CASO_AUDIO_PANEL } from "../../../data/casoAudioPanel"
import { FinestraModale } from "../finestra/FinestraModale"
import { Apertura } from "./sezioni/Apertura"
import { Sintesi } from "./sezioni/Sintesi"
import { Problema } from "./sezioni/Problema"
import { Processo } from "./sezioni/Processo"
import { DesignSystem } from "./sezioni/DesignSystem"
import { Responsive } from "./sezioni/Responsive"
import { Codice } from "./sezioni/Codice"
import { Imparato } from "./sezioni/Imparato"
import stili from "./FinestraAudioPanel.module.css"

const TOTALE = String(SEZIONI_AUDIO_PANEL.length).padStart(2, "0")

/* Porta in vista una sezione della pagina */
const vaiA = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

export function FinestraAudioPanel() {
  const aperta = useAppSelector((stato) => stato.audioPanel.aperta)
  const dispatch = useAppDispatch()
  const pagina = useRef<HTMLDivElement>(null)
  const [attiva, setAttiva] = useState(0)

  if (!aperta) return null

  const chiudi = () => dispatch(chiudiAudioPanel())

  const provaNellaStanza = () => {
    chiudi()
    dispatch(esci())
  }

  /* Sezione attiva: l'ultima che ha superato il 40% della vista */
  const aggiornaAttiva = () => {
    const contenitore = pagina.current
    if (!contenitore) return
    const soglia = contenitore.scrollTop + contenitore.clientHeight * 0.4
    const sezioni = contenitore.querySelectorAll<HTMLElement>("[data-sezione]")
    let indice = 0
    sezioni.forEach((sezione, i) => {
      if (sezione.offsetTop <= soglia) indice = i
    })
    setAttiva(indice) // React ignora i set con lo stesso valore
  }

  return (
    <FinestraModale etichetta={CASO_AUDIO_PANEL.titolo} onChiudi={chiudi} className={stili.finestra}>
      <header className={stili.testata}>
        <span className={stili.marchio}>{CASO_AUDIO_PANEL.titolo}</span>
        <nav className={stili.menu} aria-label="Sezioni">
          {SEZIONI_AUDIO_PANEL.map((sezione, i) =>
            "etichetta" in sezione ? (
              <button
                key={sezione.id}
                type="button"
                className={stili.voce}
                aria-current={i === attiva ? "true" : undefined}
                onClick={() => vaiA(sezione.id)}
              >
                {sezione.etichetta}
              </button>
            ) : null,
          )}
        </nav>
        <button type="button" className={stili.chiudi} onClick={chiudi} aria-label="Chiudi Audio Panel">
          ✕
        </button>
      </header>

      <div ref={pagina} className={stili.pagina} onScroll={aggiornaAttiva}>
        <Apertura onProva={provaNellaStanza} onScopri={() => vaiA("ap-sintesi")} totale={TOTALE} />
        <Sintesi />
        <Problema />
        <Processo />
        <DesignSystem />
        <Responsive />
        <Codice />
        <Imparato onProva={provaNellaStanza} />
      </div>

      <p className={stili.indicatore} aria-hidden="true">
        <span>{String(attiva + 1).padStart(2, "0")}</span>
        <span className={stili.lineetta} />
        <span>{TOTALE}</span>
      </p>
      {/* su mobile l'indicatore diventa una barra di avanzamento */}
      <span
        className={stili.avanzamento}
        style={{ scale: `${(attiva + 1) / SEZIONI_AUDIO_PANEL.length} 1` }}
        aria-hidden="true"
      />
    </FinestraModale>
  )
}
