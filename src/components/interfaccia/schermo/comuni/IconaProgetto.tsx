/*
 * Icona di un progetto
 * L'immagine disegnata (public/images/progetti/<id>/icona.webp) su un
 * quadrato del colore del progetto. Se l'immagine manca o non si carica
 * compaiono le iniziali: un progetto nuovo funziona anche prima di
 * avere la sua icona.
 * Misura e arrotondamento li decide chi la usa (className): sul
 * desktop è piccola e poco arrotondata, sul telefono è uno "squircle".
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
      className={`${stili.icona} ${className}`}
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
