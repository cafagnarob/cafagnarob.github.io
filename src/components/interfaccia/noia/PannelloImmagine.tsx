/*
 * Pannello immagine
 * Un elemento della galleria in stile editoriale: una linea nera sopra,
 * il numero e il nome file in macchina da scrivere, poi l'immagine in
 * un riquadro crema più scuro.
 * width/height reali: il browser riserva lo spazio prima del download.
 * loading="lazy": le immagini più in basso si scaricano solo quando
 * servono.
 * Con `piena` (foto di campagna) l'immagine riempie il riquadro e il
 * blocco arancio del pannello grande sporge fuori, in basso a destra.
 * Se riceve onApri, il riquadro diventa cliccabile (un pulsante
 * trasparente steso sopra) e apre il visore a tutto schermo.
 */
import type { ImmagineNoia } from "../../../data/noia"
import stili from "./PannelloImmagine.module.css"

type Props = {
  immagine: ImmagineNoia
  /** posizione nella raccolta: 1 → "01" */
  numero?: number
  grande?: boolean
  /** foto di campagna: riempie il riquadro, senza cornice */
  piena?: boolean
  onApri?: () => void
}

export function PannelloImmagine({ immagine, numero, grande = false, piena = false, onApri }: Props) {
  return (
    <figure className={`${stili.pannello} ${grande ? stili.grande : ""} ${piena ? stili.piena : ""}`}>
      <figcaption className={stili.etichetta}>
        {numero !== undefined && <span>{String(numero).padStart(2, "0")}</span>}
        {immagine.nomeFile}
      </figcaption>
      <div className={stili.riquadro}>
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
      </div>
    </figure>
  )
}
