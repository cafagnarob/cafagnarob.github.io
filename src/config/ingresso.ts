/*
 * Pagina iniziale
 * - IMMAGINI: render di Blender (insegna spenta / accesa) per i due formati.
 *   Il formato "mobile" si usa sugli schermi verticali.
 * - FUOCO_*: punto dell'immagine da tenere sempre visibile quando lo
 *   schermo ha proporzioni diverse (object-position): l'insegna.
 *   In percentuale: "50% 45%" = centro in orizzontale, poco sopra il centro.
 * - TITOLO / SOTTOTITOLO: testi sopra la scena.
 * - LUCE_MASSIMA_CARICAMENTO: quanto si accende l'insegna durante il
 *   caricamento (0–1); a caricamento finito sfarfalla e arriva a 1.
 */
const CARTELLA = "/images/ingresso"

export const IMMAGINI = {
  desktop: {
    spento: `${CARTELLA}/ingresso_desktop_spento.webp`,
    acceso: `${CARTELLA}/ingresso_desktop_acceso.webp`,
  },
  mobile: {
    spento: `${CARTELLA}/ingresso_mobile_spento.webp`,
    acceso: `${CARTELLA}/ingresso_mobile_acceso.webp`,
  },
}

export const FUOCO_DESKTOP = "50% 45%"
export const FUOCO_MOBILE = "50% 48%"

export const TITOLO = "Roberto Cafagna"
export const SOTTOTITOLO = "Portfolio · consigliato con l’audio"
export const LUCE_MASSIMA_CARICAMENTO = 0.6
