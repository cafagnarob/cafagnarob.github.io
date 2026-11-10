/*
 * Converte i render della pagina iniziale in WebP
 * Uso:  node scripts/converti-ingresso.mjs "<cartella dei PNG>"
 *
 * - Cerca ingresso_<desktop|mobile>_<spento|acceso>.png nella cartella
 *   e scrive i .webp in public/images/ingresso/.
 * - Qualità 82: invisibile la differenza, file 10-20 volte più leggeri.
 * - "effort" 6 = compressione più lenta ma più efficace (si fa una volta).
 */
import sharp from "sharp"
import { mkdirSync, statSync } from "node:fs"
import path from "node:path"

const SORGENTE = process.argv[2]
const DESTINAZIONE = "public/images/ingresso"
const QUALITA = 82

if (!SORGENTE) {
  console.log('Uso: node scripts/converti-ingresso.mjs "<cartella dei PNG>"')
  process.exit(1)
}

mkdirSync(DESTINAZIONE, { recursive: true })
const kb = (byte) => `${Math.round(byte / 1024)} KB`

for (const formato of ["desktop", "mobile"]) {
  for (const stato of ["spento", "acceso"]) {
    const nome = `ingresso_${formato}_${stato}`
    const png = path.join(SORGENTE, `${nome}.png`)
    const webp = path.join(DESTINAZIONE, `${nome}.webp`)
    try {
      await sharp(png).webp({ quality: QUALITA, effort: 6 }).toFile(webp)
      console.log(
        `✔ ${nome}  ${kb(statSync(png).size)} → ${kb(statSync(webp).size)}`,
      )
    } catch (errore) {
      console.log(`✖ ${nome}: ${errore.message}`)
    }
  }
}
