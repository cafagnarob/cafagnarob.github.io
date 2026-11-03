/*
 * Pannello audio (handoff Figma)
 * Controllo fisso in basso a destra: spettro di tutto l'audio del sito
 * (musica, pioggia, città), manopola del volume, selettore mute.
 * Da chiuso resta visibile solo lo spettro; si apre al clic.
 *
 * Misure in px reali (l'handoff Figma è disegnato a 2x).
 * - LIVELLI: LED per colonna (verde 1–6, giallo 7–9, rosso 10–11)
 * - ATTACCO_MS / RILASCIO_MS: salita rapida, discesa lenta dei LED
 * RILASCIO_MUTO_MS: discesa più lenta quando il volume principale è a zero (muto)”.
 * - ARCO_MANOPOLA: 270°, da ore 7 (valore 0) a ore 5 (valore 10)
 * - SCATTI_VOLUME: valori della manopola (0–10); il volume nello
 *   store resta 0–1 (volume = scatto / SCATTI_VOLUME)
 */
export const LIVELLI = 11
export const SOGLIA_GIALLO = 7 // dal 7° LED in su: giallo
export const SOGLIA_ROSSO = 10 // dal 10° LED in su: rosso

export const ATTACCO_MS = 60
export const RILASCIO_MS = 140 // discesa mentre l'audio suona (handoff)
export const RILASCIO_MUTO_MS = 900 // discesa con muto o volume a zero: "si spegne" piano

export const ARCO_MANOPOLA = 270
export const SCATTI_VOLUME = 10

export const MARGINE_PANNELLO = 15

export const VARIANTI_PANNELLO = {
  desktop: {
    colonne: 25, // bande di frequenza: bassi a sinistra, acuti a destra
    led: 8,
    gapVerticale: 2,
    gapColonne: 4,
    padding: 25,
    chiuso: { larghezza: 363, altezza: 173 },
    aperto: { larghezza: 363, altezza: 283 },
  },
  mobile: {
    colonne: 2, // canale sinistro e destro
    led: 12,
    gapVerticale: 4,
    gapColonne: 10,
    padding: 10,
    chiuso: { larghezza: 59, altezza: 225 },
    aperto: { larghezza: 157, altezza: 225 },
  },
} as const

export type VariantePannello = keyof typeof VARIANTI_PANNELLO

/* Conversione dato dell'analisi (0–255) → LED accesi (0–11) */
export const livelloDa = (valore: number) =>
  Math.round((valore / 255) * LIVELLI)

/* Quando il pannello è "desktop" (25 bande) o "mobile" (L/R):
   stesso punto di rottura del resto del sito (899 / 900px) */
export const MEDIA_DESKTOP = "(min-width: 900px)"

/* Spettro: frequenze coperte dalle 25 bande (Hz) e scala dei canali */
export const FREQUENZA_MIN = 50
export const FREQUENZA_MAX = 16000
export const DB_MIN_CANALI = -48 // sotto: LED spenti; 0 dB = tutti accesi

/* Movimento ridotto: niente animazione, aggiornamento a scatti */
export const PASSO_RIDOTTO_MS = 150
