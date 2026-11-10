/*
 * Etichetta incisa (immagine di Figma)
 * Mostra la scritta alla sua misura reale (ETICHETTE, misure a 1x),
 * moltiplicata per "scala" (es. più piccola su mobile).
 * Decorativa (alt=""): il nome del controllo per gli screen reader lo
 * dà il controllo stesso (aria-label).
 */
import { ETICHETTE, type NomeEtichetta } from "../../../config/pannelloAudio"

type Props = { nome: NomeEtichetta; scala?: number; className?: string }

export function Etichetta({ nome, scala = 1, className = "" }: Props) {
  const { src, larghezza, altezza } = ETICHETTE[nome]
  return (
    <img
      className={className}
      src={src}
      width={Math.round(larghezza * scala)}
      height={Math.round(altezza * scala)}
      alt=""
      draggable={false}
    />
  )
}
