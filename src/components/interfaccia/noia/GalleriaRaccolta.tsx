/*
 * Galleria di una raccolta NOIA
 * Mostra una collezione (FW22-23, SS24) o una campagna (deserto,
 * metro…). Intestazione in stile poster: titolo enorme, barra nera,
 * testi tecnici piccoli (sigla e numero di elementi).
 * Poi la griglia dei media, numerati (01, 02…): ogni elemento è una
 * foto (PannelloImmagine) o un video (PannelloVideo), lo dice `tipo`.
 * Il primo elemento è "grande", con il blocco arancio dietro.
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

type Props = {
  raccolta: RaccoltaNoia
  /** "campagna": foto a tutto riquadro, senza cornice */
  variante?: "collezione" | "campagna"
}

export function GalleriaRaccolta({ raccolta, variante = "collezione" }: Props) {
  const piena = variante === "campagna"
  const [aperto, setAperto] = useState<number | null>(null)
  const idTitolo = `titolo-${raccolta.id}`
  const quanti = String(raccolta.media.length).padStart(2, "0")

  return (
    <section aria-labelledby={idTitolo}>
      <header className={stili.intestazione}>
        <h2 id={idTitolo} className={stili.titolo}>
          {raccolta.titolo}
        </h2>
        <span className={stili.barra} aria-hidden="true" />
        <p className={stili.tecnico}>
          {raccolta.sigla}
          <br />
          {quanti} elementi
        </p>
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
              numero={i + 1}
              grande={i === 0}
              piena={piena}
              onApri={() => setAperto(i)}
            />
          ) : (
            <PannelloImmagine
              key={media.src}
              immagine={media}
              numero={i + 1}
              grande={i === 0}
              piena={piena}
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
