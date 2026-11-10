/*
 * Analisi dell'audio per lo spettro di LED
 * Si aggancia all'uscita principale (dopo volume e muto): i LED
 * mostrano TUTTO l'audio del sito (musica, pioggia, città) e si
 * spengono con il muto.
 *
 *    *   uscita ──→ destination            (il suono, come prima)
 *     ├──→ analyser "bande"           (25 bande di frequenza, desktop)
 *     └──→ stereo ─→ splitter ─→ analyser L   (picco per canale, mobile)
 *                              └→ analyser R
 * "stereo" è un GainNode a guadagno 1 che porta sempre a 2 canali
 * (un suono mono va su L e R): lo splitter non sa farlo da solo.
 *
 * - Creata alla prima lettura, e solo se il contesto esiste già
 *   (contestoCreato): l'analisi non deve mai creare l'AudioContext.
 * - leggiBande / leggiCanali riempiono un array 0–255 (come vuole
 *   livelloDa); senza contesto lo riempiono di zeri.
 */
import { contestoAudio, contestoCreato } from "./contesto"
import {
  DB_MIN_CANALI,
  FREQUENZA_MAX,
  FREQUENZA_MIN,
} from "../config/pannelloAudio"

type Analisi = {
  bande: AnalyserNode
  sinistro: AnalyserNode
  destro: AnalyserNode
  frequenze: Uint8Array<ArrayBuffer>
  onda: Float32Array<ArrayBuffer>
  intervalli: Map<number, Array<[number, number]>> // bande → intervalli di bin
}

let analisi: Analisi | null = null

function crea(): Analisi {
  const { contesto, uscita } = contestoAudio()

  // Bande: fftSize 4096 → 2048 bin da ~12 Hz, abbastanza fini per i bassi
  const bande = contesto.createAnalyser()
  bande.fftSize = 4096
  bande.smoothingTimeConstant = 0.5
  bande.minDecibels = -85
  bande.maxDecibels = -20

  // Canali: lo splitter separa i canali così come arrivano ("discrete",
  // non modificabile). Un GainNode a guadagno 1 prima di lui porta
  // tutto a stereo: "speakers" distribuisce un suono mono su L e R
  const stereo = new GainNode(contesto, {
    channelCount: 2,
    channelCountMode: "explicit",
    channelInterpretation: "speakers",
  })
  const divisore = contesto.createChannelSplitter(2)
  const sinistro = contesto.createAnalyser()
  const destro = contesto.createAnalyser()
  sinistro.fftSize = destro.fftSize = 1024

  uscita.connect(bande)
  uscita.connect(stereo)
  stereo.connect(divisore)
  divisore.connect(sinistro, 0)
  divisore.connect(destro, 1)

  return {
    bande,
    sinistro,
    destro,
    frequenze: new Uint8Array(bande.frequencyBinCount),
    onda: new Float32Array(sinistro.fftSize),
    intervalli: new Map(),
  }
}

function analisiPronta() {
  if (!analisi && contestoCreato()) analisi = crea()
  return analisi
}

/* Intervalli di bin per N bande logaritmiche: calcolati una volta per
   numero di bande (dipendono dalla frequenza di campionamento) */
function intervalliPer(a: Analisi, quante: number) {
  let intervalli = a.intervalli.get(quante)
  if (!intervalli) {
    const nyquist = a.bande.context.sampleRate / 2
    const bin = (f: number) =>
      Math.round((f / nyquist) * a.bande.frequencyBinCount)
    const bordo = (k: number) =>
      FREQUENZA_MIN * (FREQUENZA_MAX / FREQUENZA_MIN) ** (k / quante)
    intervalli = Array.from({ length: quante }, (_, k): [number, number] => {
      const da = bin(bordo(k))
      return [da, Math.max(da + 1, bin(bordo(k + 1)))] // almeno un bin
    })
    a.intervalli.set(quante, intervalli)
  }
  return intervalli
}

/* Bande di frequenza (bassi → acuti): il valore di una banda è il bin
   più forte al suo interno */
export function leggiBande(valori: Uint8Array) {
  const a = analisiPronta()
  if (!a) return valori.fill(0)

  a.bande.getByteFrequencyData(a.frequenze)
  intervalliPer(a, valori.length).forEach(([da, a_], i) => {
    let massimo = 0
    for (let b = da; b < a_; b++) massimo = Math.max(massimo, a.frequenze[b])
    valori[i] = massimo
  })
  return valori
}

/* Picco di un canale in decibel, riportato su 0–255 */
function piccoCanale(a: Analisi, analyser: AnalyserNode) {
  analyser.getFloatTimeDomainData(a.onda)
  let picco = 0
  for (const campione of a.onda) picco = Math.max(picco, Math.abs(campione))
  const db = 20 * Math.log10(picco || 1e-6) // 0 → −120 dB, mai −Infinity
  const quota = Math.min(1, Math.max(0, (db - DB_MIN_CANALI) / -DB_MIN_CANALI))
  return Math.round(quota * 255)
}

/* Canali sinistro e destro: valori[0] = L, valori[1] = R */
export function leggiCanali(valori: Uint8Array) {
  const a = analisiPronta()
  if (!a) return valori.fill(0)
  valori[0] = piccoCanale(a, a.sinistro)
  valori[1] = piccoCanale(a, a.destro)
  return valori
}
