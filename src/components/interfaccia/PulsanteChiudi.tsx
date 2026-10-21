/*
 * PulsanteChiudi
 * Pulsante fisso sopra la scena 3D (es. "Chiudi armadio").
 * Riceve il testo da mostrare e l'azione da eseguire al click.
 */
import stili from "./PulsanteChiudi.module.css"

type PulsanteChiudiProps = {
  etichetta: string
  onClick: () => void
}

export function PulsanteChiudi({ etichetta, onClick }: PulsanteChiudiProps) {
  return (
    <button className={stili.pulsante} onClick={onClick}>
      ← {etichetta}
    </button>
  )
}
