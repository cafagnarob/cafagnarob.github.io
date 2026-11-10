/*
 * Fumo dalla tazza
 * - SEGNAPOSTO: empty in Blender alla base del fumo (bordo della tazza).
 * - LARGHEZZA_M / ALTEZZA_M: dimensioni del rettangolo del fumo, in metri.
 * - COLORE: in luce lineare; grigio caldo, come la luce della stanza.
 * - OPACITA: densità massima (0–1). Il fumo vero è molto trasparente.
 * - VELOCITA: quanto in fretta sale.
 */
export const SEGNAPOSTO_FUMO = "fumo_tazza"
export const LARGHEZZA_FUMO_M = 0.8
export const ALTEZZA_FUMO_M = 0.22
export const COLORE_FUMO: [number, number, number] = [0.55, 0.5, 0.46]
export const OPACITA_FUMO = 0.35
export const VELOCITA_FUMO = 1
