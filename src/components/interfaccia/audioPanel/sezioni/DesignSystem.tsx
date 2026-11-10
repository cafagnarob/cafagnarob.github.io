/*
 * 05 · Design system
 * Come la reference Beads: l'immagine grande da un lato, dall'altro i
 * componenti in righe ordinate (nome · proprietà · valori).
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function DesignSystem() {
  const { sistema } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-sistema" tono="chiara" etichetta="Design system" className={stili.dueColonne}>
      <img className={stili.immagineLato} src={sistema.immagine.src} alt={sistema.immagine.alt} loading="lazy" />

      <div>
        <p className={stili.etichetta}>05 — design system</p>
        <h2 className={stili.titolo}>Dagli atomi al pannello.</h2>
        <p className={stili.testo}>{sistema.testo}</p>

        <dl className={stili.componenti}>
          {sistema.componenti.map((c) => (
            <div key={c.nome}>
              <dt>{c.nome}</dt>
              <dd>
                <span>{c.proprieta}</span>
                {c.valori}
              </dd>
            </div>
          ))}
        </dl>

        <p className={stili.nota}>{sistema.nota}</p>
      </div>
    </Sezione>
  )
}
