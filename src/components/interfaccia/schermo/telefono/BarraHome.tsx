/*
 * Barra Home del telefono
 * La lineetta in basso dell'iPhone. Toccata:
 * - con un'app aperta → torna alla home
 * - nella home → esce dal telefono (come Esc e come "Spegni" sul desktop)
 * Cosa fa lo decide HomeTelefono con onPremi; l'area cliccabile è più
 * grande della lineetta, per il dito.
 */
import stili from "./BarraHome.module.css"

type Props = { onPremi: () => void; etichetta: string }

export function BarraHome({ onPremi, etichetta }: Props) {
  return (
    <button
      type="button"
      className={stili.barra}
      onClick={onPremi}
      aria-label={etichetta}
    >
      <span className={stili.linea} />
    </button>
  )
}
