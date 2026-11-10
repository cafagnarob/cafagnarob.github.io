/*
 * 06 · Interazioni e responsive
 * I quattro comportamenti del pannello, poi il confronto desktop/mobile
 * come una tabella a tre colonne, con l'immagine delle due versioni.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function Responsive() {
  const { responsive } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-responsive" tono="scura" etichetta="Interazioni e responsive" className={stili.colonna}>
      <div>
        <p className={stili.etichetta}>06 — interazioni e responsive</p>
        <h2 className={stili.spaziato}>Ripensare, non rimpicciolire</h2>
      </div>

      <ul className={stili.interazioni}>
        {responsive.interazioni.map((voce) => (
          <li key={voce.titolo}>
            <h3>{voce.titolo}</h3>
            <p>{voce.testo}</p>
          </li>
        ))}
      </ul>

      <div className={stili.dueColonneInterne}>
        <img className={stili.immagineLato} src={responsive.immagine.src} alt={responsive.immagine.alt} loading="lazy" />
        <div>
          <p className={stili.testo}>{responsive.testo}</p>
          <table className={stili.confronto}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={stili.nascosto}>Voce</span>
                </th>
                <th scope="col">Desktop</th>
                <th scope="col">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {responsive.confronto.map((riga) => (
                <tr key={riga.voce}>
                  <th scope="row">{riga.voce}</th>
                  <td>{riga.desktop}</td>
                  <td>{riga.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sezione>
  )
}
