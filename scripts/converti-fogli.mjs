/*
 * Converte i fogli disegnati in Photoshop (PNG con trasparenza) in WebP
 * Uso:  node scripts/converti-fogli.mjs "<cartella dei PNG>"
 * Ogni .png della cartella diventa un .webp in public/images/profilo/fogli/,
 * con la trasparenza conservata (alphaQuality alta: bordi strappati puliti).
 */
import sharp from "sharp"
import { mkdirSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

const SORGENTE = process.argv[2]
const DESTINAZIONE = "public/images/profilo/fogli"

if (!SORGENTE) {
  console.log('Uso: node scripts/converti-fogli.mjs "<cartella dei PNG>"')
  process.exit(1)
}

mkdirSync(DESTINAZIONE, { recursive: true })
for (const nome of readdirSync(SORGENTE).filter((f) =>
  f.toLowerCase().endsWith(".png"),
)) {
  const uscita = path.join(DESTINAZIONE, nome.replace(/\.png$/i, ".webp"))
  await sharp(path.join(SORGENTE, nome))
    .webp({ quality: 85, alphaQuality: 95 })
    .toFile(uscita)
  console.log(`✔ ${uscita} (${Math.round(statSync(uscita).size / 1024)} KB)`)
}
