/*
 * Pannello audio
 * Fisso in basso a destra, con margine MARGINE_PANNELLO: piastra di
 * metallo spazzolato con lo spettro di tutto l'audio del sito.
 *
 * Due elementi nello stesso angolo:
 * - CHIUSO: un pulsante con solo lo spettro (desktop 363×173, mobile
 *   59×225). popoverTarget: il clic apre il pannello aperto.
 * - APERTO: popover="auto" con spettro, manopola del volume e selettore
 *   mute (desktop 363×283, mobile 157×225). Ancorato anche lui in basso
 *   a destra e più grande, copre quello chiuso. Il browser lo chiude da
 *   solo con un clic fuori (o Esc); i clic dentro non lo chiudono.
 * - aperto (stato React) segue il browser con l'evento toggle: serve
 *   per aria-expanded sul pulsante.
 * - nascosto a schermo acceso (l'interfaccia ha il suo volume)
 *
 * La piastra: texture (solo l'interno del metallo) stirata su tutta la
 * superficie; angoli, bordo smussato e ombra in CSS, così vanno bene
 * per tutte e quattro le misure.
 */
import { useId, useState, type CSSProperties } from "react"
import { useAppSelector } from "../../../store/hooks"
import {
  IMMAGINE_PIASTRA,
  MARGINE_PANNELLO,
  VARIANTI_PANNELLO,
} from "../../../config/pannelloAudio"
import { useVariantePannello } from "./useVariantePannello"
import { Spettro } from "./Spettro"
import { ManopolaVolume } from "./ManopolaVolume"
import { SelettoreMuto } from "./SelettoreMuto"
import stili from "./PannelloAudio.module.css"

type Formato = { larghezza: number; altezza: number }

export function PannelloAudio() {
  const id = useId()
  const [aperto, setAperto] = useState(false)
  const schermoAcceso = useAppSelector((s) => s.scena.schermo?.acceso ?? false)
  const variante = useVariantePannello()
  if (schermoAcceso) return null

  const v = VARIANTI_PANNELLO[variante]
  const misure = (formato: Formato) =>
    ({
      "--larghezza": `${formato.larghezza}px`,
      "--altezza": `${formato.altezza}px`,
      "--padding": `${v.padding}px`,
      "--margine": `${MARGINE_PANNELLO}px`,
      "--piastra": `url("${IMMAGINE_PIASTRA}")`,
    }) as CSSProperties

  return (
    <>
      <button
        type="button"
        className={`${stili.pannello} ${stili.chiuso} ${stili[variante]}`}
        style={misure(v.chiuso)}
        popoverTarget={id}
        aria-expanded={aperto}
        aria-label="Apri controlli audio"
      >
        <Spettro variante={variante} />
      </button>

      <div
        id={id}
        popover="auto"
        role="group"
        aria-label="Controlli audio"
        className={`${stili.pannello} ${stili.aperto} ${stili[variante]}`}
        style={misure(v.aperto)}
        onToggle={(e) => setAperto(e.newState === "open")}
      >
        <Spettro variante={variante} />
        <ManopolaVolume className={stili.volume} />
        <SelettoreMuto variante={variante} className={stili.mute} />
      </div>
    </>
  )
}
