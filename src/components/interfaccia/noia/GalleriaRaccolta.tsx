/*
 * Galleria di una raccolta NOIA
 * Mostra una collezione (FW22-23, SS24) o una campagna (deserto,
 * metro…): titolo, sigla a badge, descrizione e la griglia dei media.
 * Ogni elemento è una foto (PannelloImmagine) o un video (PannelloVideo):
 * il campo `tipo` dice quale.
 * Il primo elemento è "grande" e apre la raccolta come una copertina.
 *
 * Visore: cliccando un pannello si apre VisoreMedia su quell'elemento,
 * e si scorre solo tra i media di questa raccolta.
 * Stato locale `aperto`: indice dell'elemento aperto, null = chiuso.
 */
import { useState } from "react"
import type { RaccoltaNoia } from "../../../data/noia"
import { PannelloImmagine } from "./PannelloImmagine"
import { PannelloVideo } from "./PannelloVideo"
import { VisoreMedia } from "./VisoreMedia"
import stili from "./GalleriaRaccolta.module.css"

type Props = { raccolta: RaccoltaNoia }

export function GalleriaRaccolta({ raccolta }: Props) {
  const [aperto, setAperto] = useState<number | null>(null)
  const idTitolo = `titolo-${raccolta.id}`

  return (
    <section aria-labelledby={idTitolo}>
      <header className={stili.intestazione}>
        <h2 id={idTitolo} className={stili.titolo}>
          {raccolta.titolo}
        </h2>
        <span className={stili.sigla}>{raccolta.sigla}</span>
        {raccolta.descrizione && (
          <p className={stili.descrizione}>{raccolta.descrizione}</p>
        )}
      </header>

      <div className={stili.griglia}>
        {raccolta.media.map((media, i) =>
          media.tipo === "video" ? (
            <PannelloVideo
              key={media.src}
              video={media}
              grande={i === 0}
              onApri={() => setAperto(i)}
            />
          ) : (
            <PannelloImmagine
              key={media.src}
              immagine={media}
              grande={i === 0}
              onApri={() => setAperto(i)}
            />
          ),
        )}
      </div>

      {aperto !== null && (
        <VisoreMedia
          titolo={raccolta.titolo}
          media={raccolta.media}
          iniziale={aperto}
          onChiudi={() => setAperto(null)}
        />
      )}
    </section>
  )
}
