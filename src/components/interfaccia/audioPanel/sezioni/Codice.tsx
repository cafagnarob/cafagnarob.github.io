/*
 * 07 · Dal design al codice
 * Lo schema dell'audio e il CSS dei LED in riquadri scuri tipo
 * terminale; i punti chiave, le scelte e l'accessibilità in righe
 * a due colonne (cosa · perché).
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function Codice() {
  const { codice } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-codice" tono="chiara" etichetta="Dal design al codice" className={stili.colonna}>
      <div>
        <p className={stili.etichetta}>07 — dal design al codice</p>
        <h2 className={stili.spaziato}>Architettura audio</h2>
      </div>

      <pre className={stili.codice}>
        <code>{codice.architettura}</code>
      </pre>

      <ul className={stili.punti}>
        {codice.punti.map((p) => (
          <li key={p.titolo}>
            <h3>{p.titolo}</h3>
            <p>{p.testo}</p>
          </li>
        ))}
      </ul>

      <div className={stili.dueColonneInterne}>
        <div>
          <h3 className={stili.sottotitoloSezione}>LED a 60 fps senza ridisegnare React</h3>
          <p className={stili.testo}>{codice.led.testo}</p>
        </div>
        <pre className={stili.codice}>
          <code>{codice.led.css}</code>
        </pre>
      </div>

      <div className={stili.dueColonneInterne}>
        <div>
          <h3 className={stili.sottotitoloSezione}>Le scelte di codice</h3>
          <dl className={stili.righe}>
            {codice.scelte.map((s) => (
              <div key={s.scelta}>
                <dt>{s.scelta}</dt>
                <dd>{s.perche}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className={stili.sottotitoloSezione}>Accessibilità</h3>
          <dl className={stili.righe}>
            {codice.accessibilita.map((a) => (
              <div key={a.elemento}>
                <dt>{a.elemento}</dt>
                <dd>{a.come}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Sezione>
  )
}
