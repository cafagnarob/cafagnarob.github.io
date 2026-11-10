/* Competenze: per ogni gruppo un titolo e le voci come etichette */
import type { GruppoCompetenze } from "../../../data/profilo"
import stili from "./ModaleProfilo.module.css"

export function SezioneCompetenze({ gruppi }: { gruppi: GruppoCompetenze[] }) {
  return (
    <>
      {gruppi.map((gruppo) => (
        <div key={gruppo.titolo} className={stili.gruppo}>
          <h3 className={stili.titoloGruppo}>{gruppo.titolo}</h3>
          <ul className={stili.etichette}>
            {gruppo.voci.map((voce) => (
              <li key={voce} className={stili.etichetta}>
                {voce}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
