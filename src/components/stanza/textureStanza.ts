/*
 * Texture della stanza
 * Elenco dei PNG da caricare con useTexture, come chiave → percorso:
 * - "<gruppo>": PNG base di ogni gruppo bakeato
 * - "<gruppo>_neon": PNG neon, solo per i gruppi con neon: true
 * - "citta", "etichettaVinile": immagini dei materiali speciali
 * Costruito una volta sola al caricamento del modulo: serve anche
 * al precaricamento (useTexture.preload in Stanza).
 */
import { CARTELLA_TEXTURE_STANZA, OGGETTI_BAKEATI } from "../../config/stanza"
import { PERCORSO_ETICHETTA_VINILE } from "../../config/giradischi"

/* Chiave della texture neon di un gruppo (es. "stanza_neon") */
export const chiaveNeon = (nome: string) => `${nome}_neon`

export const URL_TEXTURE: Record<string, string> = {
  citta: `${CARTELLA_TEXTURE_STANZA}/citta_notte.png`,
  etichettaVinile: PERCORSO_ETICHETTA_VINILE,
}

for (const [nome, opzioni] of Object.entries(OGGETTI_BAKEATI)) {
  URL_TEXTURE[nome] = `${CARTELLA_TEXTURE_STANZA}/${nome}_base.png`
  if (opzioni.neon) {
    URL_TEXTURE[chiaveNeon(nome)] =
      `${CARTELLA_TEXTURE_STANZA}/${nome}_neon.png`
  }
}
