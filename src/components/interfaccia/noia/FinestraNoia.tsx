/*
 * Finestra NOIA
 * Lo spazio che racconta il brand, in stile editoriale svizzero:
 * fondo crema, tipografia grande in inchiostro, l'arancio come blocco
 * di accento, piccoli testi tecnici in macchina da scrivere.
 * Schede: Noia (manifesto + identità) · FW22-23 · SS24 · Campagne.
 *
 * Il guscio modale (apertura, Esc, clic fuori, focus) è FinestraModale,
 * lo stesso della finestra Audio Panel. Qui c'è solo il contenuto.
 */
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { chiudiNoia } from "../../../store/sliceNoia"
import { COLLEZIONI_NOIA, type IdScheda } from "../../../data/noia"
import { FinestraModale } from "../finestra/FinestraModale"
import { BarraSchede } from "./BarraSchede"
import { SchedaNoia } from "./SchedaNoia"
import { GalleriaRaccolta } from "./GalleriaRaccolta"
import { SchedaCampagne } from "./SchedaCampagne"
import stili from "./FinestraNoia.module.css"

export function FinestraNoia() {
  const scheda = useAppSelector((stato) => stato.noia.scheda)
  const dispatch = useAppDispatch()

  if (!scheda) return null

  const chiudi = () => dispatch(chiudiNoia())

  return (
    <FinestraModale etichetta="NOIA" onChiudi={chiudi} className={stili.finestra}>
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
    </FinestraModale>
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
