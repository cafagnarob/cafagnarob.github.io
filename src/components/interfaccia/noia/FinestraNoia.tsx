/*
 * Finestra NOIA
 * Lo spazio che racconta il brand, in stile editoriale svizzero:
 * fondo crema, tipografia grande in inchiostro, l'arancio come blocco
 * di accento, piccoli testi tecnici in macchina da scrivere.
 * Schede: Noia (manifesto + identità) · FW22-23 · SS24 · Campagne.
 *
 * È un <dialog> nativo aperto con showModal():
 * - sta nel "top layer": sopra scena 3D, desktop e cartellino
 * - rende inerte il resto della pagina e tiene il focus dentro
 * - Esc lo chiude (evento `close`)
 * Il componente esiste solo quando la finestra è aperta (scheda ≠ null):
 * appena montato, il callback ref chiama showModal(). Niente useEffect.
 */
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { chiudiNoia } from "../../../store/sliceNoia"
import { COLLEZIONI_NOIA, type IdScheda } from "../../../data/noia"
import { BarraSchede } from "./BarraSchede"
import { SchedaNoia } from "./SchedaNoia"
import { GalleriaRaccolta } from "./GalleriaRaccolta"
import { SchedaCampagne } from "./SchedaCampagne"
import stili from "./FinestraNoia.module.css"

/* Callback ref fuori dal componente: sempre la stessa funzione,
   React la chiama una volta sola quando il <dialog> entra nel DOM.
   showModal() metterebbe il focus sulla prima scheda (sottolineandola):
   lo spostiamo sulla finestra stessa, che ha tabIndex={-1} */
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

export function FinestraNoia() {
  const scheda = useAppSelector((stato) => stato.noia.scheda)
  const dispatch = useAppDispatch()

  if (!scheda) return null

  const chiudi = () => dispatch(chiudiNoia())

  // React fa "risalire" l'evento close anche dai dialog figli (il
  // visore): chiudiamo solo se si è chiusa proprio questa finestra
  const chiusa = (e: SyntheticEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) chiudi()
  }

  // Clic sul velo scuro fuori dalla finestra = chiudi
  const clicFuori = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) chiudi()
  }

  return (
    <dialog
      ref={apriComeModale}
      className={stili.finestra}
      aria-label="NOIA"
      tabIndex={-1}
      onClose={chiusa}
      onKeyDown={fermaEsc}
      onClick={clicFuori}
    >
      <div className={stili.interno}>
        <header className={stili.testata}>
          <span className={stili.marchio}>
            <img src="/images/noia/mosca.webp" alt="" width={216} height={241} />
            noia
          </span>
          <BarraSchede attiva={scheda} />
          <button
            type="button"
            className={stili.chiudi}
            onClick={chiudi}
            aria-label="Chiudi NOIA"
          >
            ✕
          </button>
        </header>

        {/* key={scheda}: cambiando scheda il pannello si rimonta e lo
            scroll riparte dall'alto, senza useEffect */}
        <div
          key={scheda}
          id="pannello-noia"
          role="tabpanel"
          className={stili.contenuto}
        >
          <ContenutoScheda scheda={scheda} />
        </div>
      </div>
    </dialog>
  )
}

/* Sceglie cosa mostrare per ogni scheda */
function ContenutoScheda({ scheda }: { scheda: IdScheda }) {
  switch (scheda) {
    case "manifesto":
      return <SchedaNoia />
    case "campagne":
      return <SchedaCampagne />
    default:
      return <GalleriaRaccolta raccolta={COLLEZIONI_NOIA[scheda]} />
  }
}
