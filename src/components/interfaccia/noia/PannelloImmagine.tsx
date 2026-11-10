/*
 * Pannello immagine
 * Un capo dentro una "finestra" crema con l'etichetta-nome file in
 * alto, come nelle tavole (leather_bomber.png).
 * width/height reali: il browser riserva lo spazio prima del download.
 * loading="lazy": le immagini più in basso si scaricano solo quando
 * servono.
 * Se riceve onApri, tutto il pannello diventa cliccabile (un pulsante
 * trasparente steso sopra) e apre il visore a tutto schermo.
 */
import type { ImmagineNoia } from "../../../data/noia"
import stili from "./PannelloImmagine.module.css"

type Props = {
  immagine: ImmagineNoia
  grande?: boolean
  onApri?: () => void
}

export function PannelloImmagine({ immagine, grande = false, onApri }: Props) {
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
      {onApri && (
        <button
          type="button"
          className={stili.apri}
          onClick={onApri}
          aria-label={`Ingrandisci: ${immagine.alt}`}
        />
      )}
    </figure>
  )
}
