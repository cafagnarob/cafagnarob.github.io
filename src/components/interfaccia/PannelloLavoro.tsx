/*
 * PannelloLavoro
 * Scheda di un lavoro di moda, sopra la scena 3D.
 * - Desktop: pannello sul lato destro, alto quanto lo schermo.
 * - Mobile: pannello che sale dal basso (max 70% dello schermo),
 *   così resta visibile una parte dell'armadio.
 * - Accessibilità: il pulsante di chiusura riceve il focus all'apertura
 *   (autoFocus), e il tasto Esc chiude il pannello quando il focus è
 *   al suo interno, senza listener globali né useEffect.
 * - Senza immagini mostra un riquadro "Immagini in arrivo".
 */
import type { KeyboardEvent } from "react"
import type { LavoroModa } from "../../data/lavoriModa"
import stili from "./PannelloLavoro.module.css"

type PannelloLavoroProps = {
  lavoro: LavoroModa
  onChiudi: () => void
}

export function PannelloLavoro({ lavoro, onChiudi }: PannelloLavoroProps) {
  const gestisciTasto = (evento: KeyboardEvent<HTMLElement>) => {
    if (evento.key === "Escape") onChiudi()
  }

  return (
    <aside
      className={stili.pannello}
      aria-label={lavoro.titolo}
      onKeyDown={gestisciTasto}
    >
      <header className={stili.intestazione}>
        <div>
          <p className={stili.meta}>
            {lavoro.categoria} · {lavoro.anno}
          </p>
          <h2 className={stili.titolo}>{lavoro.titolo}</h2>
        </div>
        <button
          className={stili.chiudi}
          onClick={onChiudi}
          aria-label="Chiudi scheda"
          autoFocus
        >
          ×
        </button>
      </header>

      <p className={stili.descrizione}>{lavoro.descrizione}</p>

      <div className={stili.galleria}>
        {lavoro.immagini.length > 0 ? (
          lavoro.immagini.map((src) => (
            <img
              key={src}
              src={src}
              alt={lavoro.titolo}
              className={stili.immagine}
              loading="lazy"
            />
          ))
        ) : (
          <div className={stili.segnaposto}>Immagini in arrivo</div>
        )}
      </div>
    </aside>
  )
}
