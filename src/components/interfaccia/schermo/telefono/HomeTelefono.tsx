/*
 * Home del telefono (vista telefono)
 * Interfaccia dello schermo del telefono, come la home di un iPhone:
 * - sfondo verticale (lo stesso del telefono 3D)
 * - barra di stato in alto: ora, segnale, batteria
 * - griglia di app a 4 colonne, una per progetto
 * - in fondo alla griglia le app speciali (NOIA, Audio Panel), che
 *   aprono una finestra dedicata invece del browser
 * - toccando un progetto si apre il browser a tutto schermo;
 *   "‹" in basso torna alla home (la barra di stato resta visibile)
 */
import { useState } from "react"
import { PROGETTI, type Progetto } from "../../../../data/progetti"
import { useAppDispatch } from "../../../../store/hooks"
import { esci } from "../../../../store/azioniScena"
import { apriNoia } from "../../../../store/sliceNoia"
import { apriAudioPanel } from "../../../../store/sliceAudioPanel"
import { BarraStato } from "./BarraStato"
import { BarraHome } from "./BarraHome"
import { IconaApp } from "./IconaApp"
import { IconaAppCartella } from "./IconaAppCartella"
import { Browser } from "../comuni/browser/Browser"
import stili from "./HomeTelefono.module.css"

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
        <li>
          <IconaAppCartella
            nome="noia"
            tono="arancio"
            simbolo="/images/noia/mosca.webp"
            onApri={() => dispatch(apriNoia("manifesto"))}
          />
        </li>
        <li>
          <IconaAppCartella
            nome="audio panel"
            tono="metallo"
            simbolo="/images/audio/manopola.webp"
            onApri={() => dispatch(apriAudioPanel())}
          />
        </li>
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
