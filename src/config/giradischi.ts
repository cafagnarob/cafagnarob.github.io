/*
 * Giradischi
 * - NOMI: oggetti in Blender (origine del braccio sul perno, del vinile
 *   al centro: si ruotano attorno all'origine).
 * - ANGOLO_BRACCIO_GRADI: rotazione dal riposo al disco attorno alla
 *   verticale. Se il braccio va dalla parte sbagliata, cambia il segno.
 * - DURATA_BRACCIO_S: durata del movimento; la musica parte allo scadere,
 *   quando la puntina tocca il disco.
 * - GIRI_AL_MINUTO / ACCELERAZIONE_DISCO: velocità del vinile e quanto
 *   in fretta la raggiunge (o si ferma).
 * - Musica: file, volume e durata della dissolvenza (in secondi).
 */
export const NOME_BRACCIO = "braccio"
export const NOME_VINILE = "vinile"

export const ANGOLO_BRACCIO_GRADI = -22
export const DURATA_BRACCIO_S = 1.2

export const GIRI_AL_MINUTO = 33.3
export const ACCELERAZIONE_DISCO = 1.5

export const PERCORSO_MUSICA = "/audio/disco.mp3"
export const VOLUME_MUSICA = 0.6
export const DISSOLVENZA_MUSICA_S = 0.4

/*
 * Immagine del vinile (disco + etichetta), quadrata: il cerchio tocca i
 * bordi e il centro dell'immagine è il centro del disco.
 * LUMINOSITA_VINILE: quanto è illuminata (0–1), per non "accenderla"
 * più della stanza in penombra.
 */
export const PERCORSO_ETICHETTA_VINILE = "/textures/stanza/vinile_etichetta.png"
export const LUMINOSITA_VINILE = 0.45

/* Colore del braccio (grigio metallico). Più scuro = meno acceso
   nella penombra della stanza. */
export const COLORE_BRACCIO = "#313235"

/* Avvio del giradischi con il volume a zero: quando la puntina tocca
   il disco, il volume sale da 0 a VOLUME_AVVIO in DURATA_SALITA_VOLUME_S */
export const VOLUME_AVVIO = 0.25
export const DURATA_SALITA_VOLUME_S = 1.5
