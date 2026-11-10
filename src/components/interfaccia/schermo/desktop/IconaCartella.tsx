/*
 * Icona cartella "noia" sul desktop
 * Usa gli stessi stili di IconaDesktop (riquadro al passaggio, nome
 * ombreggiato); al posto dell'icona di un progetto mostra IconaNoia
 * a forma di cartella.
 * Non apre il browser: apre la finestra NOIA tramite onApri.
 */
import { IconaNoia } from "../../noia/IconaNoia"
import stiliIcona from "./IconaDesktop.module.css"

type Props = { onApri: () => void }

export function IconaCartella({ onApri }: Props) {
  return (
    <button
      type="button"
      className={stiliIcona.voce}
      title="Il mio brand: manifesto e collezioni"
      onClick={onApri}
    >
      <IconaNoia forma="cartella" className={stiliIcona.immagine} />
      <span className={stiliIcona.nome}>noia</span>
    </button>
  )
}
