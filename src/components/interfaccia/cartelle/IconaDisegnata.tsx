/*
 * Icona disegnata
 * Il disegno delle icone speciali (NOIA, Audio Panel), fatto in CSS:
 * - forma "cartella": cartella con linguetta (desktop del PC)
 * - forma "app": quadrato arrotondato (home del telefono)
 * - tono: "arancio" (NOIA) o "metallo" (Audio Panel)
 * - simbolo: l'immagine al centro (la mosca, la manopola…)
 * Riempie il contenitore: la misura la decide chi la usa.
 */
import stili from "./IconaDisegnata.module.css"

export type Tono = "arancio" | "metallo"

type Props = { forma: "cartella" | "app"; tono: Tono; simbolo: string }

export function IconaDisegnata({ forma, tono, simbolo }: Props) {
  return (
    <span className={`${stili.icona} ${stili[forma]} ${stili[tono]}`} aria-hidden="true">
      <img className={stili.simbolo} src={simbolo} alt="" />
    </span>
  )
}
