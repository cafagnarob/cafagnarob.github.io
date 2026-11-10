/*
 * Pannello video
 * Lo stesso pannello crema delle foto, con dentro un video.
 * Due comportamenti:
 * - clip senza sonoro: parte da solo, muto, in loop, come una GIF
 *   (i browser permettono l'autoplay solo ai video muti)
 * - film con sonoro (audio: true): fermo sul poster, con i controlli;
 *   parte solo quando lo decide chi guarda
 * Con "riduci movimento" attivo anche le clip restano ferme e mostrano
 * i controlli.
 * playsInline: su iPhone il video resta nella pagina invece di aprirsi
 * a tutto schermo.
 */
import type { VideoNoia } from "../../../data/noia"
import { useMenoMovimento } from "./useMenoMovimento"
import stili from "./PannelloImmagine.module.css"

type Props = { video: VideoNoia; grande?: boolean }

export function PannelloVideo({ video, grande = false }: Props) {
  const menoMovimento = useMenoMovimento()
  const automatico = !video.audio && !menoMovimento

  return (
    <figure className={`${stili.pannello} ${grande ? stili.grande : ""}`}>
      <figcaption className={stili.etichetta}>{video.nomeFile}</figcaption>
      <video
        src={video.src}
        poster={video.poster}
        width={video.larghezza}
        height={video.altezza}
        aria-label={video.alt}
        muted={!video.audio}
        autoPlay={automatico}
        loop={!video.audio}
        controls={!automatico}
        playsInline
        preload={automatico ? "auto" : "metadata"}
      />
    </figure>
  )
}
