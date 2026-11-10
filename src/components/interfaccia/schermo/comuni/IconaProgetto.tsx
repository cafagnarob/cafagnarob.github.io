/*
 * Icona di un progetto
 * L'immagine disegnata (public/images/progetti/<id>/icona.webp) mostrata
 * così com'è: la forma è quella del disegno, con la sua trasparenza.
 * Se l'immagine manca o non si carica compare la RISERVA: un quadrato
 * arrotondato del colore del progetto con le iniziali, così un progetto
 * nuovo funziona anche prima di avere la sua icona.
 * Chi la usa decide solo la misura (className: width) e, con la
 * variabile --raggio, quanto arrotondare la riserva. L'ombra va data
 * con filter: drop-shadow, che segue la sagoma (box-shadow farebbe un
 * rettangolo).
 */
import { useState, type CSSProperties } from "react"
import { iconaDi, type Progetto } from "../../../../data/progetti"
import stili from "./IconaProgetto.module.css"

const iniziali = (nome: string) =>
  nome
    .split(/\s+/)
    .map((parola) => parola[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

type Props = { progetto: Progetto; className?: string }

export function IconaProgetto({ progetto, className = "" }: Props) {
  const [mancante, setMancante] = useState(false)

  return (
    <span
      className={`${stili.icona} ${mancante ? stili.riserva : ""} ${className}`}
      style={{ "--colore": progetto.colore } as CSSProperties}
      aria-hidden="true"
    >
      {mancante ? (
        <span className={stili.iniziali}>{iniziali(progetto.nome)}</span>
      ) : (
        <img
          src={iconaDi(progetto)}
          alt=""
          draggable={false}
          onError={() => setMancante(true)}
        />
      )}
    </span>
  )
}
