/*
 * Selettore mute
 * Interruttore accessibile (button role="switch", aria-checked = muto)
 * disegnato come una piccola manopola tra le posizioni LIVE e MUTE,
 * con la spia rossa accesa quando l'audio è disattivato.
 * - la manopola è CorpoManopola (immagine ferma, ruota solo il puntino)
 *   agli angoli ANGOLI_MUTO della variante
 * - la spia è lo stesso LED dello spettro (Led.module.css), alla stessa
 *   misura: cambiando i LED cambia anche lei
 * - Spazio e Invio funzionano da soli: è un <button>
 * - area di tocco di almeno 44×44 (handoff)
 */
import type { CSSProperties } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { alternaMuto } from "../../../store/azioniAudio"
import {
  ANGOLI_MUTO,
  DIAMETRO_MUTO,
  VARIANTI_PANNELLO,
  type VariantePannello,
} from "../../../config/pannelloAudio"
import { CorpoManopola } from "./CorpoManopola"
import { Etichetta } from "./Etichetta"
import luce from "./Led.module.css"
import stili from "./SelettoreMuto.module.css"

type Props = { variante: VariantePannello; className?: string }

export function SelettoreMuto({ variante, className = "" }: Props) {
  const dispatch = useAppDispatch()
  const muto = useAppSelector((s) => s.audio.muto)
  const angoli = ANGOLI_MUTO[variante]

  const spia = {
    "--led": `${VARIANTI_PANNELLO[variante].led}px`,
    "--acceso": muto ? 1 : 0,
  } as CSSProperties

  return (
    <button
      type="button"
      role="switch"
      aria-checked={muto}
      aria-label="Mute"
      className={`${stili.selettore} ${stili[variante]} ${className}`}
      onClick={() => dispatch(alternaMuto())}
    >
      <Etichetta nome="live" className={stili.live} />
      <Etichetta nome="mute" className={stili.mute} />
      <span
        className={`${luce.led} ${luce.rosso} ${stili.spia}`}
        style={spia}
      />
      <CorpoManopola
        diametro={DIAMETRO_MUTO}
        angolo={muto ? angoli.muto : angoli.live}
        className={stili.manopola}
      />
    </button>
  )
}
