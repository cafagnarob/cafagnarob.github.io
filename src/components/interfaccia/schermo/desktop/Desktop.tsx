/*
 * Desktop (vista PC)
 * Interfaccia dello schermo del PC:
 * - sfondo: lo stesso del monitor 3D, in alta risoluzione
 * - icone dei progetti in colonna a sinistra, come su Windows
 *   (quando la colonna è piena si passa alla successiva)
 * - barra delle applicazioni in basso, con gli stessi progetti
 * Prossimo passo: onApri aprirà la finestra del progetto.
 */
import { PROGETTI } from "../../../../data/progetti"
import { BarraApplicazioni } from "./BarraApplicazioni"

import stili from "./Desktop.module.css"
import { IconaDesktop } from "./IconaDesktop"

export function Desktop() {
  return (
    <div className={stili.desktop}>
      <ul className={stili.icone} aria-label="Progetti">
        {PROGETTI.map((progetto) => (
          <li key={progetto.id}>
            <IconaDesktop progetto={progetto} />
          </li>
        ))}
      </ul>
      <BarraApplicazioni />
    </div>
  )
}
