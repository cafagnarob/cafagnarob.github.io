/*
 * Audio d'ambiente
 * Catena: tracce (ognuna con il suo volume) → filtro passa-basso →
 * volume di vicinanza → presenza (dentro / fuori dalla stanza) →
 * uscita principale (muto / volume del sito).
 *
 * - Le tracce sono decodificate in memoria (AudioBuffer) e ripetute
 *   con loop = true: a differenza di <audio>, il loop non ha pause.
 * - avviaAmbiente: da chiamare nel clic su "Entra" (i browser sbloccano
 *   l'audio solo dopo un'azione dell'utente). La seconda volta non fa nulla.
 * - impostaPresenzaAmbiente: l'ambiente sale entrando e si spegne piano
 *   uscendo dalla stanza (insegna Exit).
 * - impostaVicinanza(0–1): chiamata a ogni fotogramma da
 *   useAudioAmbiente; ignora le variazioni minime per non
 *   programmare cambi inutili.
 * - La frequenza del filtro varia in modo esponenziale: l'orecchio
 *   percepisce le frequenze in proporzione (900 → 1800 Hz è un salto
 *   simile a 6000 → 12000 Hz).
 */
import { contestoAudio, sbloccaAudio } from "./contesto"
import {
  DISSOLVENZA_INGRESSO_S,
  FREQUENZA_LONTANO,
  FREQUENZA_VICINO,
  LIVELLO_LONTANO,
  TRACCE_AMBIENTE,
} from "../config/ambiente"

type NodiAmbiente = {
  filtro: BiquadFilterNode
  vicinanza: GainNode
  presenza: GainNode
}

const DISSOLVENZA_PRESENZA_S = 1.5

let nodi: NodiAmbiente | null = null
let ultimaVicinanza = -1

async function avviaTraccia(
  percorso: string,
  volume: number,
  destinazione: AudioNode,
) {
  const { contesto } = contestoAudio()
  try {
    const risposta = await fetch(percorso)
    const buffer = await contesto.decodeAudioData(await risposta.arrayBuffer())
    const sorgente = contesto.createBufferSource()
    sorgente.buffer = buffer
    sorgente.loop = true
    const guadagno = contesto.createGain()
    guadagno.gain.value = 0
    sorgente.connect(guadagno).connect(destinazione)
    sorgente.start()
    // Dissolvenza d'ingresso: circa DISSOLVENZA_INGRESSO_S secondi
    guadagno.gain.setTargetAtTime(
      volume,
      contesto.currentTime,
      DISSOLVENZA_INGRESSO_S / 3,
    )
  } catch (errore) {
    console.warn(`Ambiente: traccia non avviata (${percorso}):`, errore)
  }
}

function crea() {
  if (nodi) return
  const { contesto, uscita } = contestoAudio()

  // Filtro passa-basso: ovattato da lontano, nitido vicino alla finestra
  const filtro = contesto.createBiquadFilter()
  filtro.type = "lowpass"
  filtro.frequency.value = FREQUENZA_LONTANO
  filtro.Q.value = 0.5 // taglio morbido, senza enfasi sulla frequenza di taglio

  const vicinanza = contesto.createGain()
  vicinanza.gain.value = LIVELLO_LONTANO

  const presenza = contesto.createGain()
  presenza.gain.value = 1

  // Una sola catena: filtro → vicinanza → presenza → uscita
  filtro.connect(vicinanza).connect(presenza).connect(uscita)
  nodi = { filtro, vicinanza, presenza }

  for (const { percorso, volume } of TRACCE_AMBIENTE) {
    void avviaTraccia(percorso, volume, filtro)
  }
}

/* Avvia l'ambiente. Va chiamata dentro un gesto dell'utente (il clic su
   "Entra"): solo così il browser sblocca l'audio. Chiamarla di nuovo
   non fa nulla. */
export function avviaAmbiente() {
  sbloccaAudio()
  crea()
}

/* Dentro (true) o fuori (false) dalla stanza: l'ambiente sale o si
   spegne piano. Prima che l'ambiente esista non fa nulla. */
export function impostaPresenzaAmbiente(dentro: boolean) {
  if (!nodi) return
  const { contesto } = contestoAudio()
  nodi.presenza.gain.setTargetAtTime(
    dentro ? 1 : 0,
    contesto.currentTime,
    DISSOLVENZA_PRESENZA_S / 3,
  )
}

export function impostaVicinanza(valore: number) {
  if (!nodi || Math.abs(valore - ultimaVicinanza) < 0.002) return
  ultimaVicinanza = valore
  const { contesto } = contestoAudio()
  const adesso = contesto.currentTime
  const livello = LIVELLO_LONTANO + (1 - LIVELLO_LONTANO) * valore
  const frequenza =
    FREQUENZA_LONTANO * (FREQUENZA_VICINO / FREQUENZA_LONTANO) ** valore
  nodi.vicinanza.gain.setTargetAtTime(livello, adesso, 0.1)
  nodi.filtro.frequency.setTargetAtTime(frequenza, adesso, 0.1)
}
