/*
 * Sfondo animato della stanza: il logo "noia" ripetuto in righe che
 * scorrono lentamente in direzioni opposte, a contrasto bassissimo.
 * - PERCORSO_MASCHERA: la parola bianca su trasparente (512 px di
 *   altezza, già con lo spazio tra una parola e l'altra)
 * - PROPORZIONE_PAROLA: larghezza / altezza dell'immagine (587 / 512)
 * - RIGHE_ORIZZONTALE / RIGHE_VERTICALE: quante righe stanno nell'altezza
 *   dello schermo (sul telefono in verticale le parole sono più piccole)
 * - VELOCITA: parole al secondo (0,016 ≈ una parola ogni minuto)
 * - COLORE_FONDO / COLORE_SCRITTA: due grigi vicinissimi, come nella
 *   reference. Passano dalla tonemapping: si regolano guardando la scena
 */
export const PERCORSO_MASCHERA = "/images/sfondo/noia_maschera.png"
export const PROPORZIONE_PAROLA = 587 / 584 // larghezza / altezza della texture (margine sopra e sotto incluso)

export const RIGHE_ORIZZONTALE = 2.15
export const RIGHE_VERTICALE = 3.5

export const VELOCITA = 0.016

export const COLORE_FONDO = "#1c1c20"
export const COLORE_SCRITTA = "#131315"
