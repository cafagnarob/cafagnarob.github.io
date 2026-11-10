/*
 * App "noia" nella home del telefono
 * Stessi stili delle altre app (IconaApp.module.css): pulsante .app,
 * icona .immagine (misura, ombra, effetto alla pressione), nome .nome.
 * Al posto dell'icona del progetto mostra IconaNoia in forma di app.
 * Non apre il browser: apre la finestra NOIA tramite onApri.
 */
import { IconaNoia } from "../../noia/IconaNoia"
import stiliApp from "./IconaApp.module.css"

type Props = { onApri: () => void }

export function IconaAppNoia({ onApri }: Props) {
  return (
    <button type="button" className={stiliApp.app} onClick={onApri}>
      <IconaNoia forma="app" className={stiliApp.immagine} />
      <span className={stiliApp.nome}>noia</span>
    </button>
  )
}
