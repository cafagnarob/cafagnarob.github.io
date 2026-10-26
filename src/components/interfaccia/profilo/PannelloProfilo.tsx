/*
 * Pannello del profilo
 * Si apre nella vista del letto (VISTA_PROFILO), sopra la stanza:
 * a destra su schermi larghi, come foglio dal basso su quelli stretti.
 *
 * - Sempre montato: l'apertura e la chiusura sono una transizione CSS
 *   (transform), senza stato. Chiuso è "inert": niente focus né lettura
 *   da screen reader, e i suoi link non si raggiungono con il Tab.
 * - Si chiude come ogni vista (Esc, clic fuori, "←") e con la ×.
 * - Contenuti in data/profilo.ts; ogni sezione è un suo componente.
 */
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { esci } from "../../../store/azioniScena"
import { VISTA_PROFILO } from "../../../config/profilo"
import { PROFILO } from "../../../data/profilo"

import stili from "./PannelloProfilo.module.css"
import { SezionePercorso } from "./SezionePercorso"
import { SezioneCompetenze } from "./SezioneCompetenze"
import { SezioneContatti } from "./SezioneContatti"

export function PannelloProfilo() {
  const dispatch = useAppDispatch()
  const aperto = useAppSelector(
    (s) => s.scena.entrato && s.scena.vista === VISTA_PROFILO,
  )

  return (
    <aside
      className={`${stili.pannello} ${aperto ? stili.aperto : ""}`}
      inert={!aperto}
      aria-label="Profilo"
    >
      <button
        type="button"
        className={stili.chiudi}
        aria-label="Chiudi il profilo"
        onClick={() => dispatch(esci())}
      >
        ×
      </button>

      <header className={stili.intestazione}>
        <h2 className={stili.nome}>{PROFILO.nome}</h2>
        <p className={stili.ruolo}>{PROFILO.ruolo}</p>
      </header>

      <section className={stili.sezione}>
        <h3 className={stili.titoloSezione}>Chi sono</h3>
        {PROFILO.chiSono.map((paragrafo) => (
          <p key={paragrafo} className={stili.testo}>
            {paragrafo}
          </p>
        ))}
      </section>

      <SezionePercorso tappe={PROFILO.percorso} />
      <SezioneCompetenze gruppi={PROFILO.competenze} />
      <SezioneContatti contatti={PROFILO.contatti} cv={PROFILO.cv} />
    </aside>
  )
}
