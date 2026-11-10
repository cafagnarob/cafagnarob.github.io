/*
 * Profilo
 * - VISTA_PROFILO: la vista in cui si apre il modale (il letto).
 * - MARGINE_FOTO_PX: spazio nitido attorno alla foto (la cornice è
 *   parte del letto e non si può misurare da sola).
 * - Misure del modale: DEVONO coincidere con ModaleProfilo.module.css.
 *   Servono a spostare l'inquadratura perché la foto resti nella parte
 *   libera dello schermo.
 *     MEDIA_LATERALE: sopra questa larghezza il modale è a destra,
 *                     sotto è un foglio in basso
 *     LARGHEZZA_MODALE_PX / LARGHEZZA_MODALE_VW: width: min(560px, 48vw)
 *     MARGINE_DESTRO_*: padding-right: clamp(16px, 5vw, 80px)
 *     ALTEZZA_FOGLIO: height: 62vh
 */
import type { NomeVista } from "./camera"

export const VISTA_PROFILO: NomeVista = "letto"
export const MARGINE_FOTO_PX = 28

/* Dove mettere la foto nello spazio libero dal modale (0–1):
   desktop: 0 = bordo sinistro dello schermo, 1 = bordo del modale
   telefono: 0 = bordo alto dello schermo, 1 = bordo del foglio */
export const POSIZIONE_FOTO = { laterale: 0.5, foglio: 0.5 }

/* Verso di setFocalOffset per asse: +1 o -1. Se la foto va dalla parte
   opposta a quella voluta, inverti il segno di quell'asse. */
export const VERSO_SPOSTAMENTO = { x: 1, y: -1 }

/* Foto del portafoto: file, proporzioni (larghezza / altezza) e colore
   che la moltiplica (luce calda della stanza, un po' attenuata).
   Per cambiare la foto basta sostituire il file (scripts/converti-foto.mjs). */
export const PERCORSO_FOTO = "/images/profilo/foto.webp"
export const ASPETTO_FOTO = 9 / 16
export const COLORE_FOTO: [number, number, number] = [0.9, 0.82, 0.72]

/* Volo della foto dal portafoto al primo piano */
export const DURATA_VOLO_FOTO_MS = 850
export const RITARDO_VOLO_FOTO_MS = 100

/* Misure del fascicolo: DEVONO coincidere con ModaleProfilo.module.css */
export const MEDIA_LATERALE = "(min-width: 900px)"
export const LARGHEZZA_MODALE_PX = 500
export const LARGHEZZA_MODALE_VW = 0.44
export const SPORGENZA_LINGUETTE_PX = 40 // le linguette sporgono a destra
export const MARGINE_DESTRO = { minimo: 16, vw: 0.05, massimo: 80 }
export const ALTEZZA_FOGLIO = 0.64 // su telefono: fascicolo + linguette

/* Fascicolo su desktop: altezza min(76vh, 660px), larghezza = altezza
   × 1000/1300 (proporzioni dei fogli). = ModaleProfilo.module.css */
export const ALTEZZA_MODALE_VH = 0.76
export const ALTEZZA_MODALE_PX = 660
export const PROPORZIONI_FOGLI = 1000 / 1300
