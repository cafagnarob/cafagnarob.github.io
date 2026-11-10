/*
 * Barra delle schede NOIA
 * Le linguette in alto: Manifesto · Identità · FW22-23 · SS24.
 * Cliccare una linguetta non usa uno stato locale: chiama apriNoia,
 * la stessa azione del desktop e del cartellino. Così chi apre la
 * finestra da un capo e chi cambia scheda passano dalla stessa strada.
 * Ruoli ARIA: tablist / tab, letti correttamente dagli screen reader.
 */
import { useAppDispatch } from "../../../store/hooks"
import { apriNoia } from "../../../store/sliceNoia"
import { SCHEDE_NOIA, type IdScheda } from "../../../data/noia"
import stili from "./BarraSchede.module.css"

type Props = { attiva: IdScheda }

export function BarraSchede({ attiva }: Props) {
  const dispatch = useAppDispatch()

  return (
    <nav className={stili.barra} role="tablist" aria-label="Sezioni NOIA">
      {SCHEDE_NOIA.map((scheda) => (
        <button
          key={scheda.id}
          type="button"
          role="tab"
          aria-selected={scheda.id === attiva}
          aria-controls="pannello-noia"
          className={stili.linguetta}
          onClick={() => dispatch(apriNoia(scheda.id))}
        >
          {scheda.etichetta}
        </button>
      ))}
    </nav>
  )
}
