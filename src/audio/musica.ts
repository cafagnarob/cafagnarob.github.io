/*
 * Musica del giradischi
 * Un elemento <audio> in loop collegato al contesto Web Audio con un
 * suo guadagno: le dissolvenze sono rampe del guadagno, gestite dal
 * browser (niente animazioni in JavaScript) e funzionano anche su iOS.
 *
 * - preparaMusica: da chiamare nel clic (sblocca l'audio, crea il lettore).
 * - avviaMusica / fermaMusica: dissolvenza in entrata / in uscita.
 *   Fermando, la pausa arriva a dissolvenza finita; se nel frattempo
 *   la musica riparte, la pausa viene annullata.
 * - In pausa la traccia riprende da dove si era fermata.
 */
import { contestoAudio, sbloccaAudio } from "./contesto"
import {
  DISSOLVENZA_MUSICA_S,
  PERCORSO_MUSICA,
  VOLUME_MUSICA,
} from "../config/giradischi"

let lettore: HTMLAudioElement | null = null
let volume: GainNode | null = null
let timerPausa: number | undefined

function crea() {
  if (lettore && volume) return { lettore, volume }
  const { contesto, uscita } = contestoAudio()
  lettore = new Audio(PERCORSO_MUSICA)
  lettore.loop = true
  lettore.preload = "auto"
  volume = contesto.createGain()
  volume.gain.value = 0
  contesto.createMediaElementSource(lettore).connect(volume).connect(uscita)
  return { lettore, volume }
}

/* Porta il volume a "valore" in DISSOLVENZA_MUSICA_S secondi */
function rampa(guadagno: GainNode, valore: number) {
  const { contesto } = contestoAudio()
  const adesso = contesto.currentTime
  guadagno.gain.cancelScheduledValues(adesso)
  guadagno.gain.setValueAtTime(guadagno.gain.value, adesso)
  guadagno.gain.linearRampToValueAtTime(valore, adesso + DISSOLVENZA_MUSICA_S)
}

export function preparaMusica() {
  sbloccaAudio()
  crea()
}

export function avviaMusica() {
  const { lettore, volume } = crea()
  window.clearTimeout(timerPausa)
  void lettore.play()
  rampa(volume, VOLUME_MUSICA)
}

export function fermaMusica() {
  if (!lettore || !volume) return
  rampa(volume, 0)
  const daFermare = lettore
  timerPausa = window.setTimeout(
    () => daFermare.pause(),
    DISSOLVENZA_MUSICA_S * 1000,
  )
}
