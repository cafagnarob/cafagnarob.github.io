/*
 * Converte le icone dei progetti da PNG a WebP
 * Cerca public/images/progetti/<id>/icona.png e scrive icona.webp
 * accanto, ridimensionata a 512×512 (se il PNG è più grande).
 * Uso: npm run converti-icone
 */
import { readdir, access } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const CARTELLA = "public/images/progetti"

for (const id of await readdir(CARTELLA)) {
  const png = path.join(CARTELLA, id, "icona.png")
  try {
    await access(png)
  } catch {
    continue // progetto senza PNG: niente da fare
  }
  const webp = path.join(CARTELLA, id, "icona.webp")
  await sharp(png)
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(webp)
  console.log(`✔ ${id}: icona.webp`)
}
