/*
 * Pannello audio (passo 1: solo lo stato chiuso)
 * Fisso in basso a destra, con margine MARGINE_PANNELLO: una piastra
 * di metallo spazzolato con lo spettro di tutto l'audio del sito.
 * - desktop 363×173 con 25 bande; mobile 59×225 con i canali L/R
 * - nascosto a schermo acceso (l'interfaccia ha il suo volume)
 * Prossimi passi: manopola del volume, selettore mute, apertura al clic.
 */
import type { CSSProperties } from "react"
import { useAppSelector } from "../../../store/hooks"
import {
  MARGINE_PANNELLO,
  VARIANTI_PANNELLO,
} from "../../../config/pannelloAudio"
import { useVariantePannello } from "./useVariantePannello"
import { Spettro } from "./Spettro"
import stili from "./PannelloAudio.module.css"

export function PannelloAudio() {
  const schermoAcceso = useAppSelector((s) => s.scena.schermo?.acceso ?? false)
  const variante = useVariantePannello()
  if (schermoAcceso) return null

  const { chiuso, padding } = VARIANTI_PANNELLO[variante]
  const misure = {
    "--larghezza": `${chiuso.larghezza}px`,
    "--altezza": `${chiuso.altezza}px`,
    "--padding": `${padding}px`,
    "--margine": `${MARGINE_PANNELLO}px`,
  } as CSSProperties

  return (
    <div className={stili.pannello} style={misure}>
      <Spettro variante={variante} />
    </div>
  )
}
