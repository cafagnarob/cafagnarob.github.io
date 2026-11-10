/*
 * 08 · Cosa ho imparato
 * Le quattro lezioni in grande, numerate, e la chiusura con il
 * pulsante che porta al pannello vero nella stanza.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

type Props = { onProva: () => void }

export function Imparato({ onProva }: Props) {
  const { imparato, chiusura } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-imparato" tono="scura" etichetta="Cosa ho imparato" className={stili.colonna}>
      <div>
        <p className={stili.etichetta}>08 — cosa ho imparato</p>
      </div>

      <ol className={stili.lezioni}>
        {imparato.map((lezione, i) => (
          <li key={lezione}>
            <span className={stili.numero}>{String(i + 1).padStart(2, "0")}</span>
            <p>{lezione}</p>
          </li>
        ))}
      </ol>

      <div className={stili.chiusura}>
        <p>{chiusura}</p>
        <button type="button" className={stili.pulsantePieno} onClick={onProva}>
          Spegni il computer e provalo
        </button>
      </div>
    </Sezione>
  )
}
