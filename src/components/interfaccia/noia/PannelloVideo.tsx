/*
 * Pannello video
 * Stesso stile del pannello immagine (stesso CSS), con dentro un video.
 * Nella galleria il video è un'anteprima: muto, in loop, senza
 * controlli (i browser permettono l'autoplay solo ai video muti).
 * Con "riduci movimento" attivo resta fermo sul poster.
 * I controlli veri stanno nel visore, che si apre cliccando (onApri).
 * playsInline: su iPhone il video resta nella pagina invece di aprirsi
 * a tutto schermo.
 */
import type { VideoNoia } from "../../../data/noia"
import { useMenoMovimento } from "../../../hook/useMenoMovimento"
import stili from "./PannelloImmagine.module.css"

type Props = {
  video: VideoNoia
  numero?: number
  grande?: boolean
  /** foto di campagna: riempie il riquadro, senza cornice */
  piena?: boolean
  onApri?: () => void
}

export function PannelloVideo({
  video,
  numero,
  grande = false,
  piena = false,
  onApri,
}: Props) {
  const menoMovimento = useMenoMovimento()

  return (
    <figure
      className={`${stili.pannello} ${grande ? stili.grande : ""} ${piena ? stili.piena : ""}`}
    >
      <figcaption className={stili.etichetta}>
        {numero !== undefined && <span>{String(numero).padStart(2, "0")}</span>}
        {video.nomeFile}
      </figcaption>
      <div className={stili.riquadro}>
        <video
          src={video.src}
          poster={video.poster}
          width={video.larghezza}
          height={video.altezza}
          aria-label={video.alt}
          muted
          loop
          playsInline
          autoPlay={!menoMovimento}
          preload={menoMovimento ? "none" : "auto"}
        />
        {onApri && (
          <button
            type="button"
            className={stili.apri}
            onClick={onApri}
            aria-label={`Apri il video: ${video.alt}`}
          />
        )}
      </div>
    </figure>
  )
}
