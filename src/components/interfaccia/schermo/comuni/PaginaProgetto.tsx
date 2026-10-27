/*
 * Pagina del progetto
 * Il "sito" che il browser apre: copertina nel colore del progetto
 * (icona, nome, sottotitolo, stato), descrizione, tecnologie e i
 * pulsanti verso il sito vero e il codice (solo se ci sono i link).
 * Si adatta alla larghezza del browser con @container: è stretta nella
 * finestra piccola e sul telefono, larga a schermo intero.
 */
import type { CSSProperties } from "react"
import type { Progetto } from "../../../../data/progetti"
import { IconaProgetto } from "./IconaProgetto"
import stili from "./PaginaProgetto.module.css"

export function PaginaProgetto({ progetto }: { progetto: Progetto }) {
  const { demo, codice } = progetto.link ?? {}

  return (
    <article
      className={stili.pagina}
      style={{ "--colore": progetto.colore } as CSSProperties}
    >
      <header className={stili.copertina}>
        <IconaProgetto progetto={progetto} className={stili.icona} />
        <div>
          <h1 className={stili.titolo}>{progetto.nome}</h1>
          <p className={stili.sottotitolo}>{progetto.sottotitolo}</p>
        </div>
        <span className={stili.stato}>{progetto.stato}</span>
      </header>

      <div className={stili.corpo}>
        <section className={stili.descrizione}>
          {progetto.descrizione.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </section>

        <section>
          <h2 className={stili.etichetta}>Tecnologie</h2>
          <ul className={stili.tecnologie}>
            {progetto.tecnologie.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {(demo || codice) && (
          <div className={stili.azioni}>
            {demo && (
              <a
                className={stili.pulsante}
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visita il sito
              </a>
            )}
            {codice && (
              <a
                className={`${stili.pulsante} ${stili.secondario}`}
                href={codice}
                target="_blank"
                rel="noopener noreferrer"
              >
                Codice su GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
