/*
 * Pioggia sul vetro
 * - GOCCE_PER_METRO: densità della griglia delle gocce (45 ≈ una cella
 *   ogni 2,2 cm). Più alto = gocce più piccole e fitte.
 * - VELOCITA_PIOGGIA: quanto in fretta compaiono, svaniscono e scivolano.
 * - FORZA_RIFRAZIONE: quanto la goccia deforma la città (effetto lente).
 * - LUMINOSITA_GOCCE: luminosità della città vista nelle gocce.
 * - TINTA_VETRO / OPACITA_NEBBIA: colore e densità della condensa.
 */
export const GOCCE_PER_METRO = 45
export const VELOCITA_PIOGGIA = 1
export const FORZA_RIFRAZIONE = 0.04
export const LUMINOSITA_GOCCE = 1.1
export const TINTA_VETRO: [number, number, number] = [0.35, 0.42, 0.5]
export const OPACITA_NEBBIA = 0.1
