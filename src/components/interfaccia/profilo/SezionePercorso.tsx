/*
 * Percorso: linea del tempo verticale, dal più recente al più vecchio.
 * Elenco ordinato (<ol>): l'ordine ha un significato.
 */
import type { TappaPercorso } from "../../../data/profilo"
import stili from "./ModaleProfilo.module.css"

export function SezionePercorso({ tappe }: { tappe: TappaPercorso[] }) {
  return (
    <ol className={stili.lineaTempo}>
      {tappe.map((tappa) => (
        <li key={`${tappa.ruolo}-${tappa.luogo}`} className={stili.tappa}>
          <span className={stili.periodo}>{tappa.periodo}</span>
          <span className={stili.ruoloTappa}>{tappa.ruolo}</span>
          <span className={stili.luogo}>{tappa.luogo}</span>
          {tappa.descrizione && (
            <p className={stili.testo}>{tappa.descrizione}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
