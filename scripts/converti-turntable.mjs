/*
 * Conversione dei turntable di CLO in WebP trasparenti
 *
 * Uso:
 *   node scripts/converti-turntable.mjs <cartella-png> <id-capo>
 * Esempio:
 *   node scripts/converti-turntable.mjs "C:/Users/cafag/Desktop/render/giubbotto" capo_2
 *
 * Cosa fa:
 *  1. legge i PNG in ordine NUMERICO di fotogramma
 *     (CLO li chiama 00_0, 00_1… senza zeri iniziali, quindi
 *     l'ordine alfabetico sarebbe sbagliato: 00_10 prima di 00_2)
 *  2. MISURA LO SFONDO: media dei quattro angoli del primo fotogramma.
 *     Funziona con qualsiasi sfondo a tinta unita (lime, verde, magenta…)
 *     purché diverso dai colori del capo
 *  3. SCONTORNO: per ogni pixel calcola quanto il suo colore è distante
 *     da quello dello sfondo:
 *       vicino → sfondo (trasparente)
 *       lontano → capo (opaco)
 *       in mezzo → bordo semitrasparente (contorni morbidi)
 *  *  4. DESPILL: sui pixel di bordo toglie la parte di colore dello sfondo,
 *     così sulla stanza non resta un alone colorato. In più un
 *     LIMITATORE DEL VERDE su tutto il capo toglie la luce verde che lo
 *     sfondo lime riflette sul tessuto (non usarlo per capi verdi/gialli)
 *  5. RITAGLIO COMUNE: calcola il rettangolo che contiene il capo in
 *     TUTTI i fotogrammi e ritaglia tutti con lo stesso rettangolo,
 *     così il capo non "salta" né cambia grandezza mentre ruota
 *   *  6. salva due versioni di ogni fotogramma (00.webp, 01.webp…):
 *     - public/images/moda/<id-capo>/turntable/     → alta ALTEZZA_NORMALE,
 *       leggera, per rotazione e volo
 *     - public/images/moda/<id-capo>/turntable_hd/  → piena risoluzione,
 *       caricata dal sito solo con lo zoom
 *
 * .mjs = modulo JavaScript moderno (permette "import" e "await" in Node).
 */
import { readdir, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

/* ------------------------------------------------------------
 * CONFIGURAZIONE
 * ------------------------------------------------------------ */
const QUALITA = 82 // qualità WebP del colore (0–100)
const QUALITA_ALFA = 90 // qualità WebP della trasparenza (0–100)

// Distanza di colore dallo sfondo (0 = identico, ~440 = opposto)
const DISTANZA_SFONDO = 40 // sotto: è sfondo → trasparente
const DISTANZA_CAPO = 110 // sopra: è capo → opaco (in mezzo: bordo sfumato)

const MARGINE = 0.03 // margine attorno al ritaglio (3% del lato)
const LATO_ANGOLO = 20 // lato (px) dei riquadri d'angolo per misurare lo sfondo

const ALTEZZA_NORMALE = 1100 // px: versione leggera per rotazione e volo
const QUALITA_HD = 88 // la versione HD si guarda da vicino

/* ------------------------------------------------------------
 * ARGOMENTI
 * ------------------------------------------------------------ */
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

// Versione HD (per lo zoom) in una cartella gemella: turntable_hd
const cartellaHd = `${cartellaUscita}_hd`
await mkdir(cartellaHd, { recursive: true })

/* ------------------------------------------------------------
 * FUNZIONI
 * ------------------------------------------------------------ */

/* Numero del fotogramma: cifre finali prima di ".png" ("00_12.png" → 12) */
const numeroFotogramma = (nome) => Number(nome.match(/(\d+)\.png$/i)?.[1] ?? -1)

/* Colore dello sfondo: media dei quattro angoli del primo fotogramma,
   dove c'è sicuramente solo sfondo */
async function misuraSfondo(percorso) {
  const { data, info } = await sharp(percorso)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const L = LATO_ANGOLO
  const angoli = [
    [0, 0],
    [info.width - L, 0],
    [0, info.height - L],
    [info.width - L, info.height - L],
  ]

  let r = 0,
    g = 0,
    b = 0,
    n = 0
  for (const [x0, y0] of angoli) {
    for (let y = y0; y < y0 + L; y++) {
      for (let x = x0; x < x0 + L; x++) {
        const i = (y * info.width + x) * 3
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        n++
      }
    }
  }
  return [r / n, g / n, b / n]
}

/* Scontorno + despill di un fotogramma.
   Restituisce i pixel RGBA e il rettangolo che contiene il capo. */
async function scontorna(percorso, sfondo) {
  const { data, info } = await sharp(percorso)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const [sr, sg, sb] = sfondo
  let minX = info.width,
    minY = info.height,
    maxX = -1,
    maxY = -1

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2]

    // Quanto il pixel è diverso dal colore dello sfondo
    const distanza = Math.hypot(r - sr, g - sg, b - sb)

    // Alfa: 0 vicino allo sfondo, 255 sul capo, sfumato sul bordo
    const t = (distanza - DISTANZA_SFONDO) / (DISTANZA_CAPO - DISTANZA_SFONDO)
    const alfa = Math.round(255 * Math.min(Math.max(t, 0), 1))
    data[i + 3] = alfa

    // Despill sui soli bordi: un pixel di bordo è un miscuglio di capo e
    // sfondo; togliendo la parte di sfondo si ricava il colore del capo.
    // Il capo opaco (alfa 255) non viene toccato.
    if (alfa > 0 && alfa < 255) {
      const a = alfa / 255
      const pulisci = (c, s) =>
        Math.round(Math.min(255, Math.max(0, (c - s * (1 - a)) / a)))
      data[i] = pulisci(r, sr)
      data[i + 1] = pulisci(g, sg)
      data[i + 2] = pulisci(b, sb)
    }

    // Limitatore del verde su tutto il capo: toglie la luce verde che lo
    // sfondo lime riflette sul tessuto (il motore di CLO la calcola come
    // luce vera). Sui colori neutri non cambia nulla, perché il verde è
    // già ≤ del rosso. NON usarlo per capi verdi o gialli: per quelli
    // renderizza con sfondo magenta e togli questo blocco.
    if (alfa > 0) {
      const tetto = Math.max(data[i], data[i + 2])
      if (data[i + 1] > tetto) data[i + 1] = tetto
    }

    // Aggiorna il rettangolo del capo (ignora i pixel quasi trasparenti)
    if (alfa > 10) {
      const pixel = i / 4
      const x = pixel % info.width
      const y = Math.floor(pixel / info.width)
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  return { data, info, rettangolo: { minX, minY, maxX, maxY } }
}

/* ------------------------------------------------------------
 * ESECUZIONE
 * ------------------------------------------------------------ */

// File PNG in ordine numerico di fotogramma
const file = (await readdir(cartellaPng))
  .filter((nome) => nome.toLowerCase().endsWith(".png"))
  .sort((a, b) => numeroFotogramma(a) - numeroFotogramma(b))

if (file.length === 0) {
  console.error(`Nessun PNG trovato in ${cartellaPng}`)
  process.exit(1)
}

// Colore dello sfondo, misurato sul primo fotogramma
const sfondo = await misuraSfondo(path.join(cartellaPng, file[0]))
console.log(`Sfondo rilevato: RGB(${sfondo.map(Math.round).join(", ")})`)

// Passo 1: scontorna tutti i fotogrammi e calcola il rettangolo comune
const scontornati = []
const comune = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 }

for (const nome of file) {
  const risultato = await scontorna(path.join(cartellaPng, nome), sfondo)
  scontornati.push(risultato)

  const r = risultato.rettangolo
  comune.minX = Math.min(comune.minX, r.minX)
  comune.minY = Math.min(comune.minY, r.minY)
  comune.maxX = Math.max(comune.maxX, r.maxX)
  comune.maxY = Math.max(comune.maxY, r.maxY)
}

if (comune.maxX < 0) {
  console.error(
    "Nessun capo trovato: tutti i pixel sono stati presi per sfondo.",
  )
  console.error("Prova ad abbassare DISTANZA_CAPO.")
  process.exit(1)
}

// Rettangolo con margine, senza uscire dall'immagine
const { width: W, height: H } = scontornati[0].info
const lato = Math.max(comune.maxX - comune.minX, comune.maxY - comune.minY)
const margine = Math.round(lato * MARGINE)
const left = Math.max(0, comune.minX - margine)
const top = Math.max(0, comune.minY - margine)
const ritaglio = {
  left,
  top,
  width: Math.min(W - 1, comune.maxX + margine) - left + 1,
  height: Math.min(H - 1, comune.maxY + margine) - top + 1,
}

// Passo 2: ritaglia tutti allo stesso modo e salva due versioni WebP
// trasparenti: normale (rotazione e volo) e HD (zoom)
let pesoPrima = 0
let pesoDopo = 0
let pesoHd = 0

for (const [indice, { data, info }] of scontornati.entries()) {
  const nomeFile = `${String(indice).padStart(2, "0")}.webp`
  const uscita = path.join(cartellaUscita, nomeFile)
  const uscitaHd = path.join(cartellaHd, nomeFile)

  // Stesso ritaglio per le due versioni: clone() riusa la pipeline
  const ritagliata = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).extract(ritaglio)

  await ritagliata
    .clone()
    .resize({ height: ALTEZZA_NORMALE, withoutEnlargement: true })
    .webp({ quality: QUALITA, alphaQuality: QUALITA_ALFA })
    .toFile(uscita)

  await ritagliata
    .clone()
    .webp({ quality: QUALITA_HD, alphaQuality: QUALITA_ALFA })
    .toFile(uscitaHd)

  pesoPrima += (await stat(path.join(cartellaPng, file[indice]))).size
  pesoDopo += (await stat(uscita)).size
  pesoHd += (await stat(uscitaHd)).size
  console.log(`✔ ${file[indice]} → ${nomeFile}`)
}

// Riepilogo (fuori dal ciclo: una sola volta)
const mb = (byte) => (byte / 1024 / 1024).toFixed(1)
console.log(`\n${file.length} fotogrammi in ${cartellaUscita} e ${cartellaHd}`)
console.log(`Ritaglio comune: ${ritaglio.width}×${ritaglio.height} px`)
console.log(`Peso: ${mb(pesoPrima)} MB → ${mb(pesoDopo)} MB`)
console.log(`Versione HD (caricata solo con lo zoom): ${mb(pesoHd)} MB`)
