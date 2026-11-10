/*
 * Scheda collezione (FW22-23, SS24)
 * Titolo con la sigla a badge e la griglia dei capi.
 * La prima immagine è "grande": apre la collezione come una copertina.
 */
import type { CollezioneNoia } from "../../../data/noia"
import { PannelloImmagine } from "./PannelloImmagine"
import stili from "./SchedaCollezione.module.css"

type Props = { collezione: CollezioneNoia }

export function SchedaCollezione({ collezione }: Props) {
  return (
    <section aria-labelledby={`titolo-${collezione.id}`}>
      <header className={stili.intestazione}>
        <h2 id={`titolo-${collezione.id}`} className={stili.titolo}>
          {collezione.titolo}
        </h2>
        <span className={stili.sigla}>{collezione.sigla}</span>
        {collezione.descrizione && (
          <p className={stili.descrizione}>{collezione.descrizione}</p>
        )}
      </header>

      <div className={stili.griglia}>
        {collezione.immagini.map((immagine, i) => (
          <PannelloImmagine
            key={immagine.src}
            immagine={immagine}
            grande={i === 0}
          />
        ))}
      </div>
    </section>
  )
}
