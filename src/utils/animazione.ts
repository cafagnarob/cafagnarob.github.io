/*
 * Funzioni pure per le animazioni
 * - lerp: valore intermedio tra a e b (t = 0 → a, t = 1 → b)
 * - easeInOutCubic: parte piano, accelera, rallenta all'arrivo
 *   (movimento naturale invece che a velocità costante)
 * - modulo: resto sempre positivo (in JS -1 % 32 = -1, qui 31)
 * - differenzaFotogrammi: quanti fotogrammi separano "da" e "a" lungo
 *   il giro PIÙ BREVE; negativo se conviene girare all'indietro.
 *   Es. con 32: da 24 a 0 → +8 (non -24)
 */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

export const modulo = (valore: number, totale: number) =>
  ((valore % totale) + totale) % totale

export function differenzaFotogrammi(da: number, a: number, totale: number) {
  const avanti = modulo(a - da, totale)
  return avanti > totale / 2 ? avanti - totale : avanti
}
