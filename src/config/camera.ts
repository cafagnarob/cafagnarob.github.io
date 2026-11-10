/*
 * Viste della camera
 * Ogni vista definisce dove sta la camera (posizione) e verso quale
 * punto guarda (obiettivo), in coordinate three.js (Y verso l'alto).
 *
 * - NOMI_VISTE: tutte le viste del sito. Il tipo NomeVista è ricavato
 *   da questa lista, così esiste anche a runtime (per i controlli).
 * - Le viste vengono lette dalla stanza: per ogni vista servono due
 *   empty in Blender, "vista_<nome>" (camera) e "guarda_<nome>"
 *   (punto guardato). Vedi components/scena/viste.ts.
 * - VISTE_PREDEFINITE: valori di riserva, usati se gli empty mancano.
 *   L'armadio è in un altro .glb, quindi la sua vista resta qui.
 */
type Punto = [number, number, number]

export type VistaCamera = {
  posizione: Punto
  obiettivo: Punto
}

export const NOMI_VISTE = [
  "panoramica",
  "armadio",
  "letto",
  "pc",
  "telefono",
  "giradischi",
] as const
export type NomeVista = (typeof NOMI_VISTE)[number]

/* Viste sostituite sui dispositivi touch: il PC si usa dal telefono */
export const VISTE_TOUCH: Partial<Record<NomeVista, NomeVista>> = {
  pc: "telefono",
}

/* Prefissi dei nomi degli empty in Blender */
export const PREFISSO_POSIZIONE = "vista_"
export const PREFISSO_OBIETTIVO = "guarda_"

export const VISTE_PREDEFINITE: Record<"panoramica" | "armadio", VistaCamera> =
  {
    panoramica: {
      posizione: [4, 4.2, 3.6],
      obiettivo: [-0.3, 1.2, -0.45],
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

/* Sfondo della scena 3D: uguale a quello della pagina (index.css) */
export const COLORE_SFONDO = "#1b1b1d"

/*
 * Adattamento agli schermi stretti (telefono in verticale)
 * Le viste sono regolate su ASPETTO_RIFERIMENTO (16:9). Su uno schermo più
 * stretto la camera arretra lungo la stessa direzione:
 *   fattore = (ASPETTO_RIFERIMENTO / aspetto) ^ esponente, al massimo "massimo"
 * esponente 1 = conserva tutta la larghezza (stanza piccola),
 * 0 = nessun adattamento (stanza tagliata ai lati).
 * ADATTAMENTO_PER_VISTA: eccezioni per le singole viste.
 */
export const ASPETTO_RIFERIMENTO = 16 / 9

/*
 * spostamento (metri): sposta camera e punto guardato insieme lungo gli
 * assi della camera, senza cambiare la prospettiva.
 *   destra > 0 → la stanza va a SINISTRA nello schermo (e viceversa)
 *   alto   > 0 → la stanza SCENDE nello schermo
 * Cresce da 0 (schermo 16:9) al valore pieno (ASPETTO_TELEFONO e più stretti).
 */
export const ASPETTO_TELEFONO = 9 / 19.5

export type Adattamento = {
  esponente: number
  massimo: number
  spostamento: { destra: number; alto: number }
}

export const ADATTAMENTO_STRETTO: Adattamento = {
  esponente: 0.7,
  massimo: 2.2,
  spostamento: { destra: 0, alto: 0 },
}

export const ADATTAMENTO_PER_VISTA: Partial<
  Record<NomeVista, Partial<Adattamento>>
> = {
  panoramica: { spostamento: { destra: -0.4, alto: 1.4 } },
  telefono: { esponente: 0 },
}
