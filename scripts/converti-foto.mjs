/*
 * Prepara la foto del profilo (portafoto sul comodino)
 * Uso:  node scripts/converti-foto.mjs "<percorso della foto>"
 *
 * - Ritaglia al formato 9:16 (verticale) e ridimensiona a 720 × 1280.
 *   fit "cover" + position "attention": sharp sceglie il ritaglio
 *   tenendo la zona più "interessante" (di solito il viso).
 * - Salva in WebP qualità 85 in public/images/profilo/foto.webp.
 * - 720 × 1280 basta: anche nella vista del letto la foto occupa
 *   poche centinaia di pixel sullo schermo.
 */
import sharp from "sharp"
import { mkdirSync, statSync } from "node:fs"

const SORGENTE = process.argv[2]
const DESTINAZIONE = "public/images/profilo/foto.webp"

if (!SORGENTE) {
  console.log('Uso: node scripts/converti-foto.mjs "<percorso della foto>"')
  process.exit(1)
}

mkdirSync("public/images/profilo", { recursive: true })
await sharp(SORGENTE)
  .rotate() // rispetta l'orientamento salvato dal telefono (EXIF)
  .resize({ width: 720, height: 1280, fit: "cover", position: "attention" })
  .webp({ quality: 85 })
  .toFile(DESTINAZIONE)

console.log(
  `✔ ${DESTINAZIONE} (${Math.round(statSync(DESTINAZIONE).size / 1024)} KB)`,
)
