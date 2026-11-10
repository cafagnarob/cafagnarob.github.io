/*
 * Icona NOIA
 * Il disegno dell'icona del brand, in due forme:
 * - "cartella": cartella arancio con linguetta (desktop del PC)
 * - "app": quadrato arrotondato arancio con la grana (home del telefono)
 * In entrambe la mosca sta al centro. È solo l'immagine: il pulsante,
 * il nome e il clic li mette chi la usa (IconaCartella, IconaAppNoia).
 * La dimensione arriva dal className di chi la usa.
 */
import stili from "./IconaNoia.module.css"

type Props = { forma: "cartella" | "app"; className?: string }

export function IconaNoia({ forma, className = "" }: Props) {
  return (
    <span className={`${stili.icona} ${stili[forma]} ${className}`} aria-hidden="true">
      <img className={stili.mosca} src="/images/noia/mosca.webp" alt="" />
    </span>
  )
}
