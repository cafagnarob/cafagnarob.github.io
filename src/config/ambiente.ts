/*
 * Audio d'ambiente (pioggia e città dalla finestra)
 * - TRACCE: file in loop e volume di ciascuna.
 * - LIVELLO_LONTANO: volume (0–1) nella panoramica; vicino alla
 *   finestra (vista pc) il livello è 1.
 * - FREQUENZA_*: filtro passa-basso in Hz. Da lontano il suono è
 *   ovattato (si sente attraverso la stanza), vicino è nitido.
 * - DISSOLVENZA_INGRESSO_S: l'ambiente entra lentamente, non di colpo.
 */
export const TRACCE_AMBIENTE = [
  { percorso: "/audio/pioggia.mp3", volume: 0.9 },
  { percorso: "/audio/citta.mp3", volume: 0.3 },
] as const

export const LIVELLO_LONTANO = 0.35
export const FREQUENZA_LONTANO = 3000
export const FREQUENZA_VICINO = 12000
export const DISSOLVENZA_INGRESSO_S = 2
