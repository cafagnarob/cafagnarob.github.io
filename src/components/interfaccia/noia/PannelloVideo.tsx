/*
 * Pannello video
 * Lo stesso pannello crema delle foto, con dentro un video.
 * Nella galleria il video è un'anteprima: muto, in loop, senza
 * controlli (i browser permettono l'autoplay solo ai video muti).
 * Con "riduci movimento" attivo resta fermo sul poster.
 * I controlli veri (play, pausa, tempo) stanno nel visore, che si
 * apre cliccando il pannello (onApri).
 * playsInline: su iPhone il video resta nella pagina invece di aprirsi
 * a tutto schermo.
 */
import type { VideoNoia } from "../../../data/noia"
import { useMenoMovimento } from "./useMenoMovimento"
import stili from "./PannelloImmagine.module.css"

type Props = { video: VideoNoia; grande?: boolean; onApri?: () => void }

export function PannelloVideo({ video, grande = false, onApri }: Props) {
  const menoMovimento = useMenoMovimento()

  return (
    <figure className={`${stili.pannello} ${grande ? stili.grande : ""}`}>
      <figcaption className={stili.etichetta}>{video.nomeFile}</figcaption>
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
    </figure>
  )
}
