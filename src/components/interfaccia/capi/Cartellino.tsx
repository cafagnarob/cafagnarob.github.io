/*
 * Cartellino di un capo NOIA
 * Il cartellino appeso del capo in ispezione: marchio NOIA, codice,
 * nome, collezione; poi descrizione, materiali, processo, software
 * (ogni sezione solo se il capo ha quel campo, vedi LAVORI_MODA).
 * - Desktop: appeso in alto a destra, entra oscillando come un pendolo
 *   attorno alla cima del cordino
 * - Mobile: in alto, dopo il pulsante "←"; mostra nome e collezione,
 *   "Dettagli" apre il resto (espanso: stato locale)
 * Chi lo usa lo monta con key={id}: cambiando capo il componente
 * riparte da zero (oscillazione di nuovo, dettagli chiusi), senza
 * useEffect. Solo presentazione: quando mostrarlo lo decide CartellinoCapo.
 */
import { useState, type CSSProperties } from "react"
import { codiceDi, type LavoroModa } from "../../../data/lavoriModa"
import { PERCORSO_MASCHERA } from "../../../config/sfondo"
import stili from "./Cartellino.module.css"

type Props = { id: string; lavoro: LavoroModa }

export function Cartellino({ id, lavoro }: Props) {
  const [espanso, setEspanso] = useState(false)
  const codice = codiceDi(id, lavoro)
  const idDettagli = `dettagli-${id}`
  const sottotitolo = [
    lavoro.collezione ?? lavoro.categoria,
    lavoro.stagione,
    lavoro.anno,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <aside
      className={`${stili.appeso} ${espanso ? stili.espanso : ""}`}
      style={{ "--logo": `url("${PERCORSO_MASCHERA}")` } as CSSProperties}
      aria-label={`Cartellino: ${lavoro.titolo}`}
    >
      <div className={stili.carta}>
        <header className={stili.testata}>
          <span className={stili.marchio} role="img" aria-label="NOIA" />
          <span className={stili.codice}>{codice}</span>
        </header>

        <h2 className={stili.nome}>{lavoro.titolo}</h2>
        <p className={stili.collezione}>{sottotitolo}</p>

        <button
          type="button"
          className={stili.apri}
          aria-expanded={espanso}
          aria-controls={idDettagli}
          onClick={() => setEspanso((e) => !e)}
        >
          {espanso ? "Chiudi" : "Dettagli"}
        </button>

        <div id={idDettagli} className={stili.dettagli}>
          <hr className={stili.perforazione} />
          <p className={stili.descrizione}>{lavoro.descrizione}</p>

          <dl className={stili.scheda}>
            {lavoro.materiali && (
              <>
                <dt>Materiali</dt>
                <dd>{lavoro.materiali.join(", ")}</dd>
              </>
            )}
            {lavoro.processo && (
              <>
                <dt>Processo</dt>
                <dd>
                  <ol className={stili.processo}>
                    {lavoro.processo.map((passo) => (
                      <li key={passo}>{passo}</li>
                    ))}
                  </ol>
                </dd>
              </>
            )}
            {lavoro.software && (
              <>
                <dt>Software</dt>
                <dd>
                  <ul className={stili.software}>
                    {lavoro.software.map((programma) => (
                      <li key={programma}>{programma}</li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>

          <div className={stili.codiceBarre} aria-hidden="true">
            <span />
            <small>{codice}</small>
          </div>
        </div>
      </div>
    </aside>
  )
}
