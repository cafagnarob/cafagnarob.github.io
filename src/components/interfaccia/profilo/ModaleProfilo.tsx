/*
 * Modale del profilo
 * Si apre nella vista del letto (VISTA_PROFILO): sfondo semitrasparente
 * sopra la stanza e una finestra con le sezioni del profilo a schede.
 *
 * - ModaleProfilo monta la finestra SOLO quando è aperta: a ogni
 *   apertura riparte dalla prima sezione e autoFocus porta il focus
 *   sulle schede, senza useEffect.
 * - Schede accessibili (role tablist / tab / tabpanel): ← → per passare
 *   da una sezione all'altra, Home / Fine per la prima e l'ultima.
 *   Solo la scheda attiva è raggiungibile con il Tab (tabIndex 0);
 *   le frecce spostano il focus tra le altre.
 * - Si chiude con la ×, il clic sullo sfondo, Esc e "←": tutti chiamano
 *   esci(), che riporta anche la camera alla panoramica.
 * - key={attiva} sul contenuto: cambiando sezione lo scorrimento
 *   riparte dall'alto.
 */
import { useRef, useState, type KeyboardEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { esci } from "../../../store/azioniScena"
import { VISTA_PROFILO } from "../../../config/profilo"
import { PROFILO } from "../../../data/profilo"
import { SezioneChiSono } from "./SezioneChiSono"
import { SezionePercorso } from "./SezionePercorso"
import { SezioneCompetenze } from "./SezioneCompetenze"
import { SezioneContatti } from "./SezioneContatti"
import stili from "./ModaleProfilo.module.css"

/* Le sezioni, nell'ordine delle schede */
const SEZIONI = [
  {
    id: "chi-sono",
    etichetta: "Chi sono",
    contenuto: () => <SezioneChiSono paragrafi={PROFILO.chiSono} />,
  },
  {
    id: "percorso",
    etichetta: "Percorso",
    contenuto: () => <SezionePercorso tappe={PROFILO.percorso} />,
  },
  {
    id: "competenze",
    etichetta: "Competenze",
    contenuto: () => <SezioneCompetenze gruppi={PROFILO.competenze} />,
  },
  {
    id: "contatti",
    etichetta: "Contatti",
    contenuto: () => (
      <SezioneContatti contatti={PROFILO.contatti} cv={PROFILO.cv} />
    ),
  },
]

export function ModaleProfilo() {
  const aperto = useAppSelector(
    (s) =>
      s.scena.entrato &&
      s.scena.vista === VISTA_PROFILO &&
      s.scena.vistaRaggiunta,
  )
  return aperto ? <FinestraProfilo /> : null
}

function FinestraProfilo() {
  const dispatch = useAppDispatch()
  const [attiva, setAttiva] = useState(0)
  const schede = useRef<(HTMLButtonElement | null)[]>([])

  /* Va alla sezione i (in cerchio: dopo l'ultima torna la prima) */
  const vaiASezione = (i: number, spostaFocus = true) => {
    const indice = (i + SEZIONI.length) % SEZIONI.length
    setAttiva(indice)
    if (spostaFocus) schede.current[indice]?.focus()
  }

  const tastiSchede = (e: KeyboardEvent) => {
    const azioni: Record<string, () => void> = {
      ArrowRight: () => vaiASezione(attiva + 1),
      ArrowLeft: () => vaiASezione(attiva - 1),
      Home: () => vaiASezione(0),
      End: () => vaiASezione(SEZIONI.length - 1),
    }
    const azione = azioni[e.key]
    if (azione) {
      e.preventDefault()
      azione()
    }
  }

  const sezione = SEZIONI[attiva]

  return (
    <div className={stili.sfondo} onClick={() => dispatch(esci())}>
      {/* Velo: sfoca e scurisce la stanza, tranne la foto. Separato dalla
          finestra, così la maschera non può "bucare" anche lei */}
      <div className={stili.velo} aria-hidden="true" />
      <div
        className={stili.finestra}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profilo-nome"
        onClick={(e) => e.stopPropagation()} // un clic dentro non chiude
      >
        <header className={stili.intestazione}>
          <div>
            <h2 id="profilo-nome" className={stili.nome}>
              {PROFILO.nome}
            </h2>
            <p className={stili.ruolo}>{PROFILO.ruolo}</p>
          </div>
          <button
            type="button"
            className={stili.chiudi}
            aria-label="Chiudi il profilo"
            onClick={() => dispatch(esci())}
          >
            ×
          </button>
        </header>

        <div
          className={stili.schede}
          role="tablist"
          aria-label="Sezioni del profilo"
          onKeyDown={tastiSchede}
        >
          {SEZIONI.map(({ id, etichetta }, i) => (
            <button
              key={id}
              ref={(elemento) => {
                schede.current[i] = elemento
              }}
              type="button"
              role="tab"
              id={`scheda-${id}`}
              aria-selected={i === attiva}
              aria-controls={`pannello-${id}`}
              tabIndex={i === attiva ? 0 : -1}
              autoFocus={i === 0}
              className={`${stili.scheda} ${i === attiva ? stili.attiva : ""}`}
              onClick={() => vaiASezione(i, false)}
            >
              {etichetta}
            </button>
          ))}
        </div>

        <div
          key={attiva}
          className={stili.contenuto}
          role="tabpanel"
          id={`pannello-${sezione.id}`}
          aria-labelledby={`scheda-${sezione.id}`}
          tabIndex={0}
        >
          {sezione.contenuto()}
        </div>

        <footer className={stili.piede}>
          <button
            type="button"
            className={stili.passo}
            onClick={() => vaiASezione(attiva - 1, false)}
          >
            ←{" "}
            {SEZIONI[(attiva - 1 + SEZIONI.length) % SEZIONI.length].etichetta}
          </button>
          <span className={stili.indicatore} aria-hidden="true">
            {attiva + 1} / {SEZIONI.length}
          </span>
          <button
            type="button"
            className={stili.passo}
            onClick={() => vaiASezione(attiva + 1, false)}
          >
            {SEZIONI[(attiva + 1) % SEZIONI.length].etichetta} →
          </button>
        </footer>
      </div>
    </div>
  )
}
