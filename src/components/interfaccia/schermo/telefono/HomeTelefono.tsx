/*
 * Home del telefono (vista telefono)
 * Interfaccia dello schermo del telefono, come la home di un iPhone:
 * - sfondo verticale (lo stesso del telefono 3D)
 * - barra di stato in alto: ora, segnale, batteria
 * - griglia di app a 4 colonne, una per progetto
 * Le app partono sotto la scritta "TUESDAY" dello sfondo, che fa da
 * "widget" dell'orologio.
 * Prossimo passo: onApri aprirà l'app del progetto a tutto schermo.
 */
import { PROGETTI } from "../../../../data/progetti"
import { BarraStato } from "./BarraStato"

import stili from "./HomeTelefono.module.css"
import { IconaApp } from "./IconaApp"

export function HomeTelefono() {
  return (
    <div className={stili.home}>
      <BarraStato />
      <ul className={stili.griglia} aria-label="Progetti">
        {PROGETTI.map((progetto) => (
          <li key={progetto.id}>
            <IconaApp progetto={progetto} />
          </li>
        ))}
      </ul>
    </div>
  )
}
