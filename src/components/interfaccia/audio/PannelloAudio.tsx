/*
 * Pannello audio
 * Fisso in basso a destra, con margine MARGINE_PANNELLO: piastra di
 * metallo spazzolato con lo spettro di tutto l'audio del sito.
 *
 * Due elementi nello stesso angolo, ognuno = posizione + piastra:
 * - CHIUSO: pulsante con solo lo spettro (desktop 363×173, mobile
 *   59×225). popoverTarget: il clic apre il pannello aperto.
 * - APERTO: popover="auto" con spettro e comandi (desktop 363×283,
 *   mobile 157×225). Il browser lo chiude con un clic fuori o con Esc.
 *
 * Animazione (tutta CSS, vedi il .module.css): il pannello aperto parte
 * dalla "geometria chiusa" (geometriaChiusura): ritagliato sul
 * rettangolo di quello chiuso e con lo spettro dove sta lì. Poi il
 * ritaglio si allarga, lo spettro scivola al suo posto e i comandi
 * compaiono. In chiusura lo stesso al contrario, e alla fine il
 * pannello chiuso, identico, è già lì sotto.
 *
 * - aperto (stato React) segue il browser con l'evento toggle: serve
 *   per aria-expanded sul pulsante.
 * - nascosto a schermo acceso (l'interfaccia ha il suo volume)
 */
import { useId, useState, type CSSProperties } from "react"
import { useAppSelector } from "../../../store/hooks"
import {
  DURATA_APERTURA_MS,
  IMMAGINE_PIASTRA,
  MARGINE_PANNELLO,
  VARIANTI_PANNELLO,
  geometriaChiusura,
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

  const g = geometriaChiusura(variante)
  const passaggio = {
    "--dw": `${g.dw}px`,
    "--dh": `${g.dh}px`,
    "--dx": `${g.dx}px`,
    "--dy": `${g.dy}px`,
    "--durata": `${DURATA_APERTURA_MS}ms`,
  } as CSSProperties

  return (
    <>
      <button
        type="button"
        className={`${stili.posizione} ${stili.chiuso}`}
        style={misure(v.chiuso)}
        popoverTarget={id}
        aria-expanded={aperto}
        aria-label="Apri controlli audio"
      >
        <span className={`${stili.piastra} ${stili[variante]}`}>
          <Spettro variante={variante} />
        </span>
      </button>

      <div
        id={id}
        popover="auto"
        role="group"
        aria-label="Controlli audio"
        className={`${stili.posizione} ${stili.aperto}`}
        style={{ ...misure(v.aperto), ...passaggio }}
        onToggle={(e) => setAperto(e.newState === "open")}
      >
        <div
          className={`${stili.piastra} ${stili.piastraAperta} ${stili[variante]}`}
        >
          <div className={stili.scivola}>
            <Spettro variante={variante} />
          </div>
          <div className={stili.comandi}>
            <ManopolaVolume variante={variante} className={stili.volume} />
            <SelettoreMuto variante={variante} />
          </div>
        </div>
      </div>
    </>
  )
}
