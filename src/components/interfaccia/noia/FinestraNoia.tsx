/*
 * Finestra NOIA
 * Lo spazio che racconta il brand: manifesto, identità, collezioni.
 *
 * È un <dialog> nativo aperto con showModal(), che regala tre cose
 * senza codice:
 * - sta nel "top layer": sopra la scena 3D, il desktop e il cartellino,
 *   senza combattere con gli z-index
 * - rende inerte il resto della pagina e tiene il focus dentro
 * - Esc lo chiude (evento `close`)
 *
 * Il componente esiste solo quando la finestra è aperta (scheda ≠ null):
 * appena montato, il callback ref chiama showModal(). Niente useEffect.
 */
import type { KeyboardEvent, MouseEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { chiudiNoia } from "../../../store/sliceNoia"
import { COLLEZIONI_NOIA, type IdScheda } from "../../../data/noia"
import { LogoNoia } from "./LogoNoia"
import { BarraSchede } from "./BarraSchede"
import { SchedaManifesto } from "./SchedaManifesto"
import { SchedaIdentita } from "./SchedaIdentita"
import { GalleriaRaccolta } from "./GalleriaRaccolta"
import { SchedaCampagne } from "./SchedaCampagne"
import stili from "./FinestraNoia.module.css"

/* Callback ref: React lo chiama quando il <dialog> entra nel DOM.
   È una funzione fuori dal componente, quindi sempre la stessa:
   React non la richiama a ogni render. */
function apriComeModale(dialogo: HTMLDialogElement | null) {
  if (dialogo && !dialogo.open) dialogo.showModal()
}

/* Esc: il dialog si chiude da solo, ma il tasto continuerebbe a salire
   fino alla finestra del browser, dove il portfolio lo usa per uscire
   dallo schermo del PC. Lo fermiamo qui. */
function fermaEsc(e: KeyboardEvent<HTMLDialogElement>) {
  if (e.key === "Escape") e.stopPropagation()
}

export function FinestraNoia() {
  const scheda = useAppSelector((stato) => stato.noia.scheda)
  const dispatch = useAppDispatch()

  if (!scheda) return null

  const chiudi = () => dispatch(chiudiNoia())

  // Clic sul velo scuro (fuori dalla finestra) = chiudi.
  // Il velo è il ::backdrop del dialog: il clic arriva al dialog stesso.
  const clicFuori = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) chiudi()
  }

  return (
    <dialog
      ref={apriComeModale}
      className={stili.finestra}
      aria-labelledby="titolo-noia"
      onClose={chiudi}
      onKeyDown={fermaEsc}
      onClick={clicFuori}
    >
      <div className={stili.interno}>
        <header className={stili.testata}>
          <h1 id="titolo-noia" className={stili.titolo}>
            <LogoNoia className={stili.logo} />
          </h1>
          <button
            type="button"
            className={stili.chiudi}
            onClick={chiudi}
            aria-label="Chiudi NOIA"
          >
            ✕
          </button>
        </header>

        <BarraSchede attiva={scheda} />

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

        <footer className={stili.firma}>
          <img src="/images/noia/mosca.webp" alt="" width={216} height={241} />
          <span>a project by noia</span>
        </footer>
      </div>
    </dialog>
  )
}

/* Sceglie cosa mostrare per ogni scheda */
function ContenutoScheda({ scheda }: { scheda: IdScheda }) {
  switch (scheda) {
    case "manifesto":
      return <SchedaManifesto />
    case "identita":
      return <SchedaIdentita />
    case "campagne":
      return <SchedaCampagne />
    default:
      return <GalleriaRaccolta raccolta={COLLEZIONI_NOIA[scheda]} />
  }
}
