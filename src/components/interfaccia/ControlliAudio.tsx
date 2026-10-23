/*
 * Controlli audio
 * In basso a destra: pulsante muto + cursore del volume, per tutti i
 * suoni del sito (musica, e più avanti pioggia e città).
 *
 * - Con il mouse il cursore compare passando sopra il pulsante (o con
 *   il focus da tastiera); su touch è sempre visibile, perché lì non
 *   esiste il "passare sopra".
 * - Con il muto attivo il cursore mostra 0, ma il volume scelto resta
 *   salvato: togliendo il muto si torna a quel livello.
 * - Icone disegnate in SVG: altoparlante con onde, o con una X se muto.
 */
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { alternaMuto, impostaVolume } from "../../store/azioniAudio"
import stili from "./ControlliAudio.module.css"

export function ControlliAudio() {
  const dispatch = useAppDispatch()
  const muto = useAppSelector((s) => s.audio.muto)
  const volume = useAppSelector((s) => s.audio.volume)

  return (
    <div className={stili.controlli}>
      <input
        type="range"
        className={stili.cursore}
        min={0}
        max={1}
        step={0.01}
        value={muto ? 0 : volume}
        aria-label="Volume"
        onChange={(e) => dispatch(impostaVolume(Number(e.target.value)))}
      />
      <button
        type="button"
        className={stili.pulsante}
        aria-label={muto ? "Attiva l'audio" : "Disattiva l'audio"}
        aria-pressed={muto}
        onClick={() => dispatch(alternaMuto())}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          {muto ? (
            <path
              d="M16 9l5 6M21 9l-5 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </button>
    </div>
  )
}
