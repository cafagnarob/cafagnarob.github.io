/*
 * Conversione dei turntable di CLO in WebP
 *
 * Uso:
 *   node scripts/converti-turntable.mjs <cartella-png> <id-capo>
 * Esempio:
 *   node scripts/converti-turntable.mjs "C:/Users/cafag/Desktop/render/giubbotto_pelle" capo_2
 *
 * Cosa fa:
 *  1. legge tutti i PNG della cartella, in ordine alfabetico
 *     (CLO li numera 00_0, 00_1, 00_2… quindi l'ordine è quello della rotazione)
 *  2. li converte in WebP (qualità 82: ottimo compromesso qualità/peso)
 *  3. li salva come 00.webp, 01.webp… in
 *     public/images/moda/<id-capo>/turntable/
 *  4. stampa il peso totale prima e dopo
 *
 * .mjs = modulo JavaScript moderno (permette "import" in Node).
 */
import { readdir, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const QUALITA = 82
const [cartellaPng, idCapo] = process.argv.slice(2)

if (!cartellaPng || !idCapo) {
  console.error(
    "Uso: node scripts/converti-turntable.mjs <cartella-png> <id-capo>",
  )
  process.exit(1)
}

const cartellaUscita = path.join(
  "public",
  "images",
  "moda",
  idCapo,
  "turntable",
)
await mkdir(cartellaUscita, { recursive: true })

// Numero del fotogramma: le cifre finali prima di ".png"
// (es. "00_12.png" → 12). CLO non usa zeri iniziali, quindi
// l'ordine alfabetico sarebbe sbagliato (00_10 prima di 00_2).
const numeroFotogramma = (nome) => Number(nome.match(/(\d+)\.png$/i)?.[1] ?? -1)

// Solo i PNG, in ordine NUMERICO di fotogramma
const file = (await readdir(cartellaPng))
  .filter((nome) => nome.toLowerCase().endsWith(".png"))
  .sort((a, b) => numeroFotogramma(a) - numeroFotogramma(b))

if (file.length === 0) {
  console.error(`Nessun PNG trovato in ${cartellaPng}`)
  process.exit(1)
}

let pesoPrima = 0
let pesoDopo = 0

for (const [indice, nome] of file.entries()) {
  const ingresso = path.join(cartellaPng, nome)
  const uscita = path.join(
    cartellaUscita,
    `${String(indice).padStart(2, "0")}.webp`,
  )

  await sharp(ingresso).webp({ quality: QUALITA }).toFile(uscita)

  pesoPrima += (await stat(ingresso)).size
  pesoDopo += (await stat(uscita)).size
  console.log(`✔ ${nome} → ${path.basename(uscita)}`)
}

const mb = (byte) => (byte / 1024 / 1024).toFixed(1)
console.log(`\n${file.length} fotogrammi convertiti in ${cartellaUscita}`)
console.log(`Peso: ${mb(pesoPrima)} MB → ${mb(pesoDopo)} MB`)
