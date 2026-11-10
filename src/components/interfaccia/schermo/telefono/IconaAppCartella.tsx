/*
 * App speciale nella home del telefono (NOIA, Audio Panel…)
 * Stessi stili delle altre app (IconaApp.module.css): pulsante .app,
 * icona .immagine (misura, ombra, effetto alla pressione), nome .nome.
 * Il disegno è IconaDisegnata in forma di app.
 */
import { IconaDisegnata, type Tono } from "../../cartelle/IconaDisegnata"
import stiliApp from "./IconaApp.module.css"

type Props = { nome: string; tono: Tono; simbolo: string; onApri: () => void }

export function IconaAppCartella({ nome, tono, simbolo, onApri }: Props) {
  return (
    <button type="button" className={stiliApp.app} onClick={onApri}>
      <span className={stiliApp.immagine}>
        <IconaDisegnata forma="app" tono={tono} simbolo={simbolo} />
      </span>
      <span className={stiliApp.nome}>{nome}</span>
    </button>
  )
}
