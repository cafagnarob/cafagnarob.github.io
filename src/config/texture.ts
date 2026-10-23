/*
 * Decodificatori (copiati in public/ da scripts/copia-decodificatori.mjs)
 * - USA_KTX2: carica i .ktx2 al posto dei .png con lo stesso nome
 *   (generati da scripts/converti-ktx2.mjs). false = torna ai PNG.
 * - PERCORSO_BASIS: decodificatore delle texture KTX2.
 * - PERCORSO_DRACO: decodificatore dei modelli compressi con Draco
 *   (altrimenti drei lo scaricherebbe da un server di Google).
 */
export const USA_KTX2 = true
export const PERCORSO_BASIS = "/basis/"
export const PERCORSO_DRACO = "/draco/"
