/*
 * Icona sul desktop
 * Pulsante con l'icona del progetto e il nome sotto, ombreggiato per
 * leggersi su qualsiasi sfondo. Il riquadro chiaro al passaggio del
 * mouse e al focus da tastiera imita quello di Windows.
 * Il titolo (tooltip) mostra il sottotitolo del progetto.
 */
import type { Progetto } from "../../../../data/progetti"
import { IconaProgetto } from "../comuni/IconaProgetto"
import stili from "./IconaDesktop.module.css"

type Props = { progetto: Progetto; onApri?: (progetto: Progetto) => void }

export function IconaDesktop({ progetto, onApri }: Props) {
  return (
    <button
      type="button"
      className={stili.voce}
      title={progetto.sottotitolo}
      onClick={() => onApri?.(progetto)}
    >
      <IconaProgetto progetto={progetto} className={stili.immagine} />
      <span className={stili.nome}>{progetto.nome}</span>
    </button>
  )
}
