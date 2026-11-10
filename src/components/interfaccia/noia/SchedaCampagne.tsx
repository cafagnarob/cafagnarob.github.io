/*
 * Scheda campagne
 * Le campagne una sotto l'altra (deserto, metro, film, strada),
 * ognuna con la sua galleria: stesso componente delle collezioni.
 */
import { CAMPAGNE_NOIA } from "../../../data/noia"
import { GalleriaRaccolta } from "./GalleriaRaccolta"
import stili from "./SchedaCampagne.module.css"

export function SchedaCampagne() {
  return (
    <div className={stili.campagne}>
      {CAMPAGNE_NOIA.map((campagna) => (
        <GalleriaRaccolta key={campagna.id} raccolta={campagna} />
      ))}
    </div>
  )
}
