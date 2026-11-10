/*
 * Icona cartella sul desktop
 * Una cartella che apre una finestra dedicata (NOIA, Audio Panel…),
 * invece del browser dei progetti.
 * Usa gli stessi stili di IconaDesktop (riquadro al passaggio, nome
 * ombreggiato); il disegno è IconaDisegnata in forma di cartella.
 */
import { IconaDisegnata, type Tono } from "../../cartelle/IconaDisegnata"
import stiliIcona from "./IconaDesktop.module.css"

type Props = {
  nome: string
  titolo: string
  tono: Tono
  simbolo: string
  onApri: () => void
}

export function IconaCartella({ nome, titolo, tono, simbolo, onApri }: Props) {
  return (
    <button type="button" className={stiliIcona.voce} title={titolo} onClick={onApri}>
      <span className={stiliIcona.immagine}>
        <IconaDisegnata forma="cartella" tono={tono} simbolo={simbolo} />
      </span>
      <span className={stiliIcona.nome}>{nome}</span>
    </button>
  )
}
