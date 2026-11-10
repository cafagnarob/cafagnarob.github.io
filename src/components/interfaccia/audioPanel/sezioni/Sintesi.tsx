/*
 * 02 · In sintesi
 * Come la pagina Braun: a sinistra un elenco piccolo e ordinato (le
 * informazioni del progetto), a destra una frase in grande.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function Sintesi() {
  const { sintesi, citazione } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-sintesi" tono="scura" etichetta="In sintesi" className={stili.sintesi}>
      <dl className={stili.scheda}>
        {sintesi.map(({ voce, valore }) => (
          <div key={voce}>
            <dt>{voce}</dt>
            <dd>{valore}</dd>
          </div>
        ))}
      </dl>

      <blockquote className={stili.citazione}>
        <p className={stili.premessa}>{citazione.premessa}</p>
        <p className={stili.frase}>{citazione.frase}</p>
      </blockquote>
    </Sezione>
  )
}
