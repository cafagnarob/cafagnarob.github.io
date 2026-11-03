/*
 * Corpo di una manopola (solo aspetto)
 * L'immagine della base resta FERMA: i riflessi della luce in alto a
 * sinistra non devono girare. Ruota solo il puntino rosso, disegnato
 * in CSS, all'angolo ricevuto (gradi, 0 = ore 12, orario).
 * L'immagine ha attorno al corpo un margine per l'ombra (corpo 204 px
 * su 234): viene ingrandita di 234/204 e centrata, così il CORPO
 * misura esattamente "diametro".
 * Usato da ManopolaVolume e dal selettore mute.
 */
import type { CSSProperties } from "react"
import {
  IMMAGINE_MANOPOLA,
  PROPORZIONE_CORPO,
} from "../../../config/pannelloAudio"
import stili from "./CorpoManopola.module.css"

type Props = { diametro: number; angolo: number; className?: string }

export function CorpoManopola({ diametro, angolo, className = "" }: Props) {
  const misure = {
    "--diametro": `${diametro}px`,
    "--tela": `${diametro / PROPORZIONE_CORPO}px`,
    "--angolo": `${angolo}deg`,
  } as CSSProperties

  return (
    <span
      className={`${stili.corpo} ${className}`}
      style={misure}
      aria-hidden="true"
    >
      <img
        className={stili.base}
        src={IMMAGINE_MANOPOLA}
        alt=""
        draggable={false}
      />
      <span className={stili.indicatore} />
    </span>
  )
}
