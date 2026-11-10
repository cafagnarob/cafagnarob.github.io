/*
 * Icona di un'app sul telefono
 * Icona "squircle" (angoli al 22,5% come iOS) con il nome sotto su una
 * riga. Alla pressione si rimpicciolisce leggermente (:active), come
 * su un telefono vero.
 */
import type { Progetto } from "../../../../data/progetti"
import { IconaProgetto } from "../comuni/IconaProgetto"
import stili from "./IconaApp.module.css"

type Props = { progetto: Progetto; onApri?: (progetto: Progetto) => void }

export function IconaApp({ progetto, onApri }: Props) {
  return (
    <button
      type="button"
      className={stili.app}
      onClick={() => onApri?.(progetto)}
    >
      <IconaProgetto progetto={progetto} className={stili.immagine} />
      <span className={stili.nome}>{progetto.nome}</span>
    </button>
  )
}
