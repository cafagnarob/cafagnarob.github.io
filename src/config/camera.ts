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
