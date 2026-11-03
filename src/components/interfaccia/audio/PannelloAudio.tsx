/*
 * Pannello audio
 * Fisso in basso a destra, con margine MARGINE_PANNELLO: piastra di
 * metallo spazzolato con lo spettro di tutto l'audio del sito.
 * - chiuso: solo lo spettro (desktop 363×173, mobile 59×225)
 * - aperto: spettro + manopola del volume (+ mute, passo 3)
 *   (desktop 363×283, mobile 157×225)
 * - nascosto a schermo acceso (l'interfaccia ha il suo volume)
 * La piastra: texture (solo l'interno del metallo) stirata su tutta la
 * superficie; angoli, bordo smussato e ombra in CSS, così vanno bene
 * per tutte e quattro le misure.
 */
import type { CSSProperties } from "react"
import { useAppSelector } from "../../../store/hooks"
import {
  IMMAGINE_PIASTRA,
  MARGINE_PANNELLO,
  VARIANTI_PANNELLO,
} from "../../../config/pannelloAudio"
import { useVariantePannello } from "./useVariantePannello"
import { Spettro } from "./Spettro"
import { ManopolaVolume } from "./ManopolaVolume"
import stili from "./PannelloAudio.module.css"

const APERTO = true // PROVVISORIO: l'apertura al clic arriva al passo 4

export function PannelloAudio() {
  const schermoAcceso = useAppSelector((s) => s.scena.schermo?.acceso ?? false)
  const variante = useVariantePannello()
  if (schermoAcceso) return null

  const v = VARIANTI_PANNELLO[variante]
  const formato = APERTO ? v.aperto : v.chiuso
  const misure = {
    "--larghezza": `${formato.larghezza}px`,
    "--altezza": `${formato.altezza}px`,
    "--padding": `${v.padding}px`,
    "--margine": `${MARGINE_PANNELLO}px`,
    "--piastra": `url("${IMMAGINE_PIASTRA}")`,
  } as CSSProperties

  return (
    <div
      className={`${stili.pannello} ${stili[variante]} ${APERTO ? stili.aperto : ""}`}
      style={misure}
    >
      <Spettro variante={variante} />
      {APERTO && <ManopolaVolume className={stili.volume} />}
    </div>
  )
}
