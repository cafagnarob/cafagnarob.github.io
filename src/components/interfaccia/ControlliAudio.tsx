/*
 * Controlli audio
 * In basso a destra: pulsante muto + cursore del volume, per tutti i
 * suoni del sito (musica, pioggia, città).
 *
 * - Nascosti a schermo acceso: lì l'interfaccia (desktop/telefono)
 *   occupa tutto lo schermo e ha il suo comando del volume
 *   (ComandoVolume). Si nasconde solo il comando: musica e volume
 *   restano come sono, perché vivono nello slice "audio".
 * - Con il mouse il cursore compare passando sopra il pulsante (o con
 *   il focus da tastiera); su touch è sempre visibile, perché lì non
 *   esiste il "passare sopra".
 * - Con il muto attivo il cursore mostra 0, ma il volume scelto resta
 *   salvato: togliendo il muto si torna a quel livello.
 * - Icona condivisa con le interfacce (IconaVolume): altoparlante con
 *   una o due onde secondo il livello, o una X se è a zero.
 */
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { alternaMuto, impostaVolume } from "../../store/azioniAudio"
import { IconaVolume } from "./schermo/comuni/volume/IconaVolume"
import stili from "./ControlliAudio.module.css"

export function ControlliAudio() {
  const dispatch = useAppDispatch()
  const muto = useAppSelector((s) => s.audio.muto)
  const volume = useAppSelector((s) => s.audio.volume)
  const schermoAcceso = useAppSelector((s) => s.scena.schermo?.acceso ?? false)

  // Dopo TUTTI gli hook: a ogni render vanno chiamati sempre gli
  // stessi, nello stesso ordine, anche se poi non si mostra nulla
  if (schermoAcceso) return null

  const livello = muto ? 0 : volume

  return (
    <div className={stili.controlli}>
      <input
        type="range"
        className={stili.cursore}
        min={0}
        max={1}
        step={0.01}
        value={livello}
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
        <IconaVolume livello={livello} className={stili.icona} />
      </button>
    </div>
  )
}
