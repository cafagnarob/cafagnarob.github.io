/*
 * Configurazione delle luci bakeate
 *
 * In Blender ogni passaggio è stato salvato con un'esposizione
 * negativa per non "bruciare" il PNG (base -1, led -2, neon -1).
 * Qui definiamo i moltiplicatori che riportano la luce al valore
 * originale: moltiplicatore = 2 ^ (-esposizione).
 *   base: -1 → × 2    led: -2 → × 4    neon: -1 → × 2
 * Se in futuro cambi un'esposizione in Blender, cambia solo qui.
 */
export type Passaggio = "base" | "led" | "neon"

export const MOLTIPLICATORI: Record<Passaggio, number> = {
  base: 2,
  led: 4,
  neon: 2,
}
