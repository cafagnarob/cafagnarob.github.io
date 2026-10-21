/*
 * Configurazione dell'ispezione dei capi
 *
 * - DISTANZA: a quanti metri davanti alla camera si posiziona il capo.
 * - OCCUPAZIONE_SCHERMO: quanta parte del lato più corto dello schermo
 *   occupa il capo (0.7 = 70%). Funziona sia su schermi orizzontali
 *   (desktop) sia verticali (mobile).
 * - VELOCITA: velocità del volo (più alto = più veloce).
 * - LUMINOSITA: schiarimento del capo durante l'ispezione, perché la
 *   luce bakeata dentro l'armadio è più scura di quella "da vetrina".
 * - ROTAZIONE_FRONTALE_GRADI: correzione per i capi che, una volta
 *   davanti alla camera, risultano di lato o di spalle.
 *   Prova 90, -90 o 180. I capi non elencati non hanno correzione.
 */
export const DISTANZA_ISPEZIONE = 1.2
export const OCCUPAZIONE_SCHERMO = 0.7
export const VELOCITA_ISPEZIONE = 4
export const LUMINOSITA_ISPEZIONE = 0.5

export const ROTAZIONE_FRONTALE_GRADI: Record<string, number> = {
  // capo_1: 90,
}

/*
 * Soglia click / trascinamento (pixel)
 * Se tra la pressione e il rilascio il puntatore si è spostato più di
 * così, era un trascinamento (rotazione del capo) e non un click.
 */
export const SOGLIA_TRASCINAMENTO_PX = 6
