/*
 * Configurazione della vetrina (visore turntable)
 *
 * - PIXEL_PER_FOTOGRAMMA: pixel di trascinamento per passare al fotogramma
 *   successivo (più basso = rotazione più sensibile).
 * - DURATA_VOLO_MS: durata del volo dall'armadio al centro (e ritorno).
 * - LUMINOSITA_ARMADIO / LUMINOSITA_VETRINA: luminosità del render
 *   all'inizio del volo (in penombra, come il capo nell'armadio) e al
 *   centro. Il passaggio graduale nasconde la sostituzione 3D → render.
 * - MARGINE_RITAGLIO: DEVE essere uguale a MARGINE nello script
 *   converti-turntable.mjs. Serve a far coincidere l'altezza del capo
 *   nel render con quella del capo nell'armadio.
 */
export const PIXEL_PER_FOTOGRAMMA = 14
export const DURATA_VOLO_MS = 800
export const LUMINOSITA_ARMADIO = 0.45
export const LUMINOSITA_VETRINA = 0.88
export const MARGINE_RITAGLIO = 0.03

/*
 * Zoom nella vetrina
 * - ZOOM_MASSIMO: ingrandimento massimo (3 = tre volte)
 * - SENSIBILITA_ROTELLA: quanto zooma ogni scatto della rotella
 * - SOGLIA_HD: oltre questo zoom si carica la versione HD del fotogramma
 * - PASSO_TASTIERA: fattore di zoom dei tasti + e −
 */
export const ZOOM_MASSIMO = 3
export const SENSIBILITA_ROTELLA = 0.0015
export const SOGLIA_HD = 1.3
export const PASSO_TASTIERA = 1.25
