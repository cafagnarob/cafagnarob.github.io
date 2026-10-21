/*
 * Viste della camera
 * Ogni vista definisce dove sta la camera (posizione) e verso quale
 * punto guarda (obiettivo), in coordinate three.js (Y verso l'alto).
 *
 * - panoramica: vista iniziale sull'armadio (diventerà la vista della
 *   stanza intera quando aggiungeremo la stanza).
 * - armadio: frontale, davanti all'armadio aperto. L'armadio ha la
 *   facciata rivolta verso +X e il centro in (-2.42, 1, 0).
 *
 * Per regolare un'inquadratura, cambia solo questi numeri.
 */
type Punto = [number, number, number]

export type VistaCamera = {
  posizione: Punto
  obiettivo: Punto
}

export const VISTE: Record<"panoramica" | "armadio", VistaCamera> = {
  panoramica: {
    posizione: [9, 5.5, 8.5],
    obiettivo: [-2.42, 1, 0],
  },
  armadio: {
    posizione: [0.7, 1.15, 0],
    obiettivo: [-2.42, 1.1, 0],
  },
}

/*
 * Escursione della camera
 * Di quanti gradi l'utente può ruotare la vista attorno alla
 * posizione di ogni vista: abbastanza per dare profondità,
 * troppo poco per vedere dietro i muri.
 */
export const ESCURSIONE_ORIZZONTALE_GRADI = 10
export const ESCURSIONE_VERTICALE_GRADI = 5
