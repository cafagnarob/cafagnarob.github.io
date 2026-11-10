/*
 * Pannello immagine
 * Un capo dentro una "finestra" crema con l'etichetta-nome file in
 * alto, come nelle tavole (leather_bomber.png).
 * width/height reali: il browser riserva lo spazio prima del download.
 * loading="lazy": le immagini più in basso si scaricano solo quando
 * servono.
 */
import type { ImmagineNoia } from "../../../data/noia"
import stili from "./PannelloImmagine.module.css"

type Props = { immagine: ImmagineNoia; grande?: boolean }

export function PannelloImmagine({ immagine, grande = false }: Props) {
  return (
    <figure className={`${stili.pannello} ${grande ? stili.grande : ""}`}>
      <figcaption className={stili.etichetta}>{immagine.nomeFile}</figcaption>
      <img
        src={immagine.src}
        alt={immagine.alt}
        width={immagine.larghezza}
        height={immagine.altezza}
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}
