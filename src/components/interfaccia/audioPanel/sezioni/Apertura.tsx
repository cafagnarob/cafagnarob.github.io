/*
 * 01 · Apertura
 * Il prodotto protagonista al centro, il nome enorme in trasparenza
 * dietro (come le pagine prodotto delle reference), e in basso: numero
 * di sezione, tag e i due pulsanti.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

type Props = { onProva: () => void; onScopri: () => void; totale: string }

export function Apertura({ onProva, onScopri, totale }: Props) {
  const { titolo, sottotitolo, tag, copertina } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-apertura" tono="chiara" etichetta="Apertura" className={stili.apertura}>
      <p className={stili.nomeGigante} aria-hidden="true">
        {titolo}
      </p>

      <figure className={stili.protagonista}>
        <img src={copertina.src} alt={copertina.alt} />
      </figure>

      <div className={stili.piede}>
        <div className={stili.piedeSinistra}>
          <span className={stili.contatore}>
            01 <span>/ {totale}</span>
          </span>
          <h1 className={stili.titoloApertura}>{titolo}</h1>
          <p className={stili.sottotitolo}>{sottotitolo}</p>
          <ul className={stili.tag}>
            {tag.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className={stili.azioni}>
          <button type="button" className={stili.pulsanteChiaro} onClick={onScopri}>
            Scopri il progetto ↓
          </button>
          <button type="button" className={stili.pulsantePieno} onClick={onProva}>
            Provalo nella stanza
          </button>
        </div>
      </div>
    </Sezione>
  )
}
