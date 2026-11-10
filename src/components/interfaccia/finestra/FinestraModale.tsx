/*
 * Finestra modale
 * Il guscio comune delle finestre del portfolio (NOIA, Audio Panel…):
 * un <dialog> nativo aperto con showModal(), che regala:
 * - il "top layer": sta sopra scena 3D, desktop e cartellino
 * - il resto della pagina inerte e il focus tenuto dentro
 * - Esc che lo chiude (evento `close`)
 * Chi lo usa decide aspetto e contenuto (className, children) e cosa
 * fare alla chiusura (onChiudi). Il componente si monta solo quando la
 * finestra è aperta: il callback ref chiama showModal(). Niente useEffect.
 */
import type { KeyboardEvent, MouseEvent, ReactNode, SyntheticEvent } from "react"
import stili from "./FinestraModale.module.css"

type Props = {
  /** nome letto dagli screen reader */
  etichetta: string
  onChiudi: () => void
  className?: string
  children: ReactNode
}

/* Callback ref fuori dal componente: sempre la stessa funzione, React la
   chiama una volta sola. Il focus va sulla finestra stessa (tabIndex -1):
   altrimenti showModal() lo darebbe al primo pulsante, evidenziandolo */
function apriComeModale(dialogo: HTMLDialogElement | null) {
  if (dialogo && !dialogo.open) {
    dialogo.showModal()
    dialogo.focus()
  }
}

/* Esc chiude il dialog, ma non deve arrivare alla finestra del browser,
   dove il portfolio lo usa per uscire dallo schermo del PC */
function fermaEsc(e: KeyboardEvent<HTMLDialogElement>) {
  if (e.key === "Escape") e.stopPropagation()
}

export function FinestraModale({ etichetta, onChiudi, className = "", children }: Props) {
  // React fa "risalire" close e click anche dai dialog figli (es. un
  // visore aperto sopra): reagiamo solo se il bersaglio è questa finestra
  const soloQuesta = (e: SyntheticEvent<HTMLDialogElement> | MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onChiudi()
  }

  return (
    <dialog
      ref={apriComeModale}
      className={`${stili.finestra} ${className}`}
      aria-label={etichetta}
      tabIndex={-1}
      onClose={soloQuesta}
      onKeyDown={fermaEsc}
      onClick={soloQuesta} // clic sul velo scuro fuori dalla finestra
    >
      {/* contenitore pieno: i clic "fuori" arrivano solo dal velo */}
      <div className={stili.interno}>{children}</div>
    </dialog>
  )
}
