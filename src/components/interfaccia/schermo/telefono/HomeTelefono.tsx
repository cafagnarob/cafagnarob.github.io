/*
 * Home del telefono (vista telefono)
 * Interfaccia dello schermo del telefono, come la home di un iPhone:
 * - sfondo verticale (lo stesso del telefono 3D)
 * - barra di stato in alto: ora, segnale, batteria
 * - griglia di app a 4 colonne, una per progetto
 * - toccando un'app si apre il browser a tutto schermo sul progetto;
 *   "‹" in basso torna alla home (la barra di stato resta visibile)
 */
import { useState } from "react"
import { PROGETTI, type Progetto } from "../../../../data/progetti"
import { BarraStato } from "./BarraStato"
import { IconaApp } from "./IconaApp"
import { Browser } from "../comuni/browser/Browser"
import stili from "./HomeTelefono.module.css"
import { useAppDispatch } from "../../../../store/hooks"
import { BarraHome } from "./BarraHome"
import { esci } from "../../../../store/azioniScena"

export function HomeTelefono() {
  const dispatch = useAppDispatch()
  const [aperto, setAperto] = useState<Progetto | null>(null)

  return (
    <div className={stili.home}>
      <BarraStato />
      <ul className={stili.griglia} aria-label="Progetti">
        {PROGETTI.map((progetto) => (
          <li key={progetto.id}>
            <IconaApp progetto={progetto} onApri={setAperto} />
          </li>
        ))}
      </ul>

      {aperto && (
        <Browser
          key={aperto.id}
          progetto={aperto}
          variante="telefono"
          onChiudi={() => setAperto(null)}
        />
      )}

      <BarraHome
        onPremi={aperto ? () => setAperto(null) : () => dispatch(esci())}
        etichetta={aperto ? "Torna alla home" : "Esci dal telefono"}
      />
    </div>
  )
}
