/*
 * Manopola del volume
 * Slider accessibile (role="slider", valori 0–SCATTI_VOLUME) disegnato
 * come una manopola, con la scala di tacche attorno e "VOLUME" inciso.
 * Lo store tiene il volume 0–1: la manopola mostra lo scatto più vicino
 * e imposta volume = scatto / SCATTI_VOLUME.
 *
 * Comandi:
 * - trascinamento (mouse, dito, penna: Pointer Events) verso l'alto o
 *   verso destra = più volume, uno scatto ogni PIXEL_PER_SCATTO px.
 *   setPointerCapture: il trascinamento continua anche fuori dalla
 *   manopola. Inizio del trascinamento in una ref: serve ai movimenti
 *   successivi ma non deve provocare render.
 * - tastiera: frecce ±1, Home / End = minimo / massimo
 * - rotellina: ±1
 */
import { useRef, type CSSProperties, type KeyboardEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { impostaVolume } from "../../../store/azioniAudio"
import {
  DIAMETRO_VOLUME,
  PIXEL_PER_SCATTO,
  SCALA_TACCHE,
  SCATTI_VOLUME,
  angoloDi,
} from "../../../config/pannelloAudio"
import { CorpoManopola } from "./CorpoManopola"
import stili from "./ManopolaVolume.module.css"

const TASTI: Record<string, (valore: number) => number> = {
  ArrowUp: (v) => v + 1,
  ArrowRight: (v) => v + 1,
  ArrowDown: (v) => v - 1,
  ArrowLeft: (v) => v - 1,
  Home: () => 0,
  End: () => SCATTI_VOLUME,
}

export function ManopolaVolume({ className = "" }: { className?: string }) {
  const dispatch = useAppDispatch()
  const volume = useAppSelector((s) => s.audio.volume)
  const valore = Math.round(volume * SCATTI_VOLUME)
  const inizio = useRef<{ x: number; y: number; valore: number } | null>(null)

  const imposta = (nuovo: number) => {
    const limitato = Math.min(SCATTI_VOLUME, Math.max(0, nuovo))
    if (limitato !== valore) dispatch(impostaVolume(limitato / SCATTI_VOLUME))
  }

  const tasto = (e: KeyboardEvent) => {
    const calcola = TASTI[e.key]
    if (!calcola) return
    e.preventDefault() // le frecce non devono scorrere la pagina
    imposta(calcola(valore))
  }

  const misure = {
    "--scala": `${SCALA_TACCHE}px`,
  } as CSSProperties

  return (
    <div className={`${stili.blocco} ${className}`}>
      <div
        className={stili.manopola}
        style={misure}
        role="slider"
        tabIndex={0}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={SCATTI_VOLUME}
        aria-valuenow={valore}
        aria-valuetext={`${valore * 10}%`}
        onKeyDown={tasto}
        onWheel={(e) => imposta(valore + (e.deltaY < 0 ? 1 : -1))}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          inizio.current = { x: e.clientX, y: e.clientY, valore }
        }}
        onPointerMove={(e) => {
          const t = inizio.current
          if (!t) return
          const spostamento = e.clientX - t.x + (t.y - e.clientY) // destra / su = +
          imposta(t.valore + Math.round(spostamento / PIXEL_PER_SCATTO))
        }}
        onPointerUp={() => (inizio.current = null)}
        onPointerCancel={() => (inizio.current = null)}
      >
        {/* Scala: una tacca per scatto, sullo stesso arco del puntino */}
        {Array.from({ length: SCATTI_VOLUME + 1 }, (_, k) => (
          <span
            key={k}
            className={stili.tacca}
            style={{ "--angolo": `${angoloDi(k)}deg` } as CSSProperties}
          />
        ))}
        <CorpoManopola
          diametro={DIAMETRO_VOLUME}
          angolo={angoloDi(valore)}
          className={stili.corpo}
        />
      </div>
      <span className={stili.etichetta}>Volume</span>
    </div>
  )
}
