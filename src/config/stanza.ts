import type { NomeVista } from "./camera"

/*
 * Configurazione della stanza
 * - PERCORSO_MODELLO_STANZA / CARTELLA_TEXTURE_STANZA: dove sono i file
 * - OGGETTI_BAKEATI: un gruppo per ogni PNG bakeato in Blender.
 *     esposizione  → stessa dello script di bake (moltiplicatore 2^-esposizione)
 *     neon         → esiste anche <nome>_neon.png (luce dell'insegna, sfarfalla)
 *     doppiaFaccia → superfici sottili visibili da entrambi i lati (foglie, tessuti)
 * - OGGETTI_SPECIALI: oggetti con materiali creati nel codice (nomi come in Blender)
 */
export const PERCORSO_MODELLO_STANZA = "/models/stanza_V2.glb"
export const CARTELLA_TEXTURE_STANZA = "/textures/stanza"

/* Insegna "Exit": cliccata nella panoramica riporta alla pagina iniziale.
   INTENSIFICAZIONE_USCITA: quanto si accende di più al passaggio del mouse */
export const OGGETTO_USCITA = "neon insegna"
export const INTENSIFICAZIONE_USCITA = 0.5

export type OggettoBakeato = {
  esposizione: number
  neon?: boolean
  doppiaFaccia?: boolean
}

export const OGGETTI_BAKEATI: Record<string, OggettoBakeato> = {
  stanza: { esposizione: -1, neon: true },
  finestra: { esposizione: -1 },
  armadio_fisso: { esposizione: -1 },
  letto: { esposizione: -2 },
  scrivania: { esposizione: -1 },
  pc: { esposizione: -2 },
  arredi: { esposizione: -2, neon: true },
  piante: { esposizione: -1 },
  giradischi: { esposizione: -1 },
}

export const OGGETTI_SPECIALI = {
  vetroFinestra: "vetro",
  vetroFoto: "vetro_foto",
  foto: "foto",
  neon: "neon insegna",
  citta: "citta notte",
  vinile: "vinile",
  braccio: "braccio",
  schermi: ["screen", "screen.001", "schermo_telefono"],
} as const

/*
 * Oggetti cliccabili dalla panoramica → vista che aprono.
 * Nomi come in Blender. Più oggetti possono aprire la stessa vista:
 * passando sopra uno qualsiasi si illumina tutto il gruppo.
 */
export const OGGETTI_CLICCABILI: Record<string, NomeVista> = {
  letto: "letto",
  foto: "letto",
  vetro_foto: "letto",
  pc: "pc",
  screen: "pc",
  "screen.001": "pc",
  schermo_telefono: "pc",
  giradischi: "giradischi",
  braccio: "giradischi",
  vinile: "giradischi",
}

/* Intensità dell'alone al passaggio del mouse (come l'armadio chiuso) */
export const ALONE_STANZA = 0.7
