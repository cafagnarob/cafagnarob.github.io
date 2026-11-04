/*
 * Etichetta incisa (immagine di Figma)
 * Mostra la scritta alla sua misura reale (ETICHETTE, misure a 1x).
 * Decorativa (alt=""): il nome del controllo per gli screen reader lo
 * dà il controllo stesso (aria-label).
 */
import { ETICHETTE, type NomeEtichetta } from "../../../config/pannelloAudio"

type Props = { nome: NomeEtichetta; className?: string }

export function Etichetta({ nome, className = "" }: Props) {
  const { src, larghezza, altezza } = ETICHETTE[nome]
  return (
    <img
      className={className}
      src={src}
      width={larghezza}
      height={altezza}
      alt=""
      draggable={false}
    />
  )
}
