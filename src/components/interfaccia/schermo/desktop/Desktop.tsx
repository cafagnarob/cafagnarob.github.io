/*
 * Desktop (vista PC)
 * Interfaccia dello schermo del PC:
 * - sfondo: lo stesso del monitor 3D, in alta risoluzione
 * - icone dei progetti in colonna a sinistra, come su Windows
 * - barra delle applicazioni in basso, con Start e gli stessi progetti
 * Stato locale (sparisce da solo quando si esce dallo schermo):
 * - aperto: il progetto mostrato nel browser (null = nessuno)
 * - menuStart: menu Start aperto; un velo trasparente lo chiude
 *   cliccando fuori
 * - spegnimento: "Spegni" avvia l'animazione del vecchio monitor; alla
 *   sua fine (onAnimationEnd) si esce come con Esc
 */
import { useState } from "react"
import { PROGETTI, type Progetto } from "../../../../data/progetti"
import { useAppDispatch } from "../../../../store/hooks"
import { esci } from "../../../../store/azioniScena"
import { IconaDesktop } from "./IconaDesktop"
import { BarraApplicazioni } from "./BarraApplicazioni"
import { MenuStart } from "./MenuStart"
import { Browser } from "../comuni/browser/Browser"
import stili from "./Desktop.module.css"
import { IconaCartella } from "./IconaCartella"
import { apriNoia } from "../../../../store/sliceNoia"
import { apriAudioPanel } from "../../../../store/sliceAudioPanel"

export function Desktop() {
  const dispatch = useAppDispatch()
  const [aperto, setAperto] = useState<Progetto | null>(null)
  const [menuStart, setMenuStart] = useState(false)
  const [spegnimento, setSpegnimento] = useState(false)

  const apri = (progetto: Progetto) => {
    setAperto(progetto)
    setMenuStart(false)
  }

  const spegni = () => {
    setMenuStart(false)
    setSpegnimento(true)
  }

  return (
    <div
      className={`${stili.desktop} ${spegnimento ? stili.spegnimento : ""}`}
      onAnimationEnd={(e) => {
        // Gli eventi di animazione "risalgono" dai figli (browser,
        // menu…): reagiamo solo a quella del desktop stesso
        if (spegnimento && e.target === e.currentTarget) dispatch(esci())
      }}
    >
      <ul className={stili.icone} aria-label="Progetti">
        {PROGETTI.map((progetto) => (
          <li key={progetto.id}>
            <IconaDesktop progetto={progetto} onApri={apri} />
          </li>
        ))}
        <li>
          <IconaCartella
            nome="noia"
            titolo="Il mio brand: manifesto e collezioni"
            tono="arancio"
            simbolo="/images/noia/mosca.webp"
            onApri={() => dispatch(apriNoia("manifesto"))}
          />
        </li>
        <li>
          <IconaCartella
            nome="audio panel"
            titolo="Caso studio: il pannello audio"
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
          variante="finestra"
          onChiudi={() => setAperto(null)}
        />
      )}

      {menuStart && (
        <>
          <div className={stili.velo} onClick={() => setMenuStart(false)} />
          <MenuStart onApri={apri} onSpegni={spegni} />
        </>
      )}

      <BarraApplicazioni
        onApri={apri}
        onStart={() => setMenuStart((m) => !m)}
        menuAperto={menuStart}
      />
    </div>
  )
}
