/*
 * Conversione dei turntable di CLO in WebP trasparenti
 *
 * Uso:
 *   node scripts/converti-turntable.mjs "<cartella-png>" <id-capo> [modo]
 * Esempi:
 *   node scripts/converti-turntable.mjs "C:/Users/cafag/Downloads/borsa" capo_1
 *   node scripts/converti-turntable.mjs "C:/Users/cafag/Downloads/pantalone" capo_5 verde
 * (in Git Bash: barre "/" e percorso tra virgolette se contiene spazi)
 *
 * Tre tipi di render, riconosciuti così:
 *  - TRASPARENTE (automatico): se gli angoli del primo fotogramma sono già
 *    trasparenti, CLO ha esportato senza sfondo → si tiene la sua alfa,
 *    niente scontorno
 *  - COLORE (predefinito): sfondo a tinta unita di qualsiasi colore
 *    (lime, magenta, nero…) → trasparente ciò che è vicino al colore
 *    misurato negli angoli
 *  - VERDE (terzo argomento "verde"): sfondo verde anche SFUMATO →
 *    trasparente ciò che è molto più verde che rosso e blu.
 *    NON per capi verdi o gialli
 *
 * Cosa fa:
 *  1. legge i PNG in ordine NUMERICO di fotogramma
 *     (CLO li chiama 00_0, 00_1… senza zeri iniziali, quindi
 *     l'ordine alfabetico sarebbe sbagliato: 00_10 prima di 00_2)
 *  2. capisce il tipo di render (vedi sopra)
 *  3. SCONTORNO (solo colore/verde): alfa 0 sullo sfondo, 255 sul capo,
 *     sfumata sui bordi per contorni morbidi
 *  4. DESPILL (solo colore/verde): toglie dai bordi il colore dello
 *     sfondo e limita il verde riflesso sul tessuto
 *  5. RITAGLIO COMUNE: il rettangolo che contiene il capo in TUTTI i
 *     fotogrammi, uguale per tutti, così il capo non "salta" né cambia
 *     grandezza mentre ruota
 *  6. salva due versioni di ogni fotogramma (00.webp, 01.webp…):
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
const QUALITA_HD = 88 // la versione HD si guarda da vicino
const ALTEZZA_NORMALE = 1100 // px: versione leggera per rotazione e volo

// Modo COLORE: distanza dal colore dello sfondo (0 = identico, ~440 = opposto)
const DISTANZA_SFONDO = 40 // sotto: è sfondo → trasparente
const DISTANZA_CAPO = 110 // sopra: è capo → opaco (in mezzo: bordo sfumato)

// Modo VERDE: quanto il verde supera il massimo tra rosso e blu
const ECCESSO_CAPO = 25 // sotto: è capo → opaco
const ECCESSO_SFONDO = 85 // sopra: è sfondo → trasparente

const MARGINE = 0.03 // margine attorno al ritaglio (3% del lato)
const LATO_ANGOLO = 20 // lato (px) dei riquadri d'angolo per misurare lo sfondo
const ALFA_VISIBILE = 10 // sopra questa alfa un pixel conta come capo

/* ------------------------------------------------------------
 * ARGOMENTI
 * ------------------------------------------------------------ */
const [cartellaPng, idCapo, modoScelto = "colore"] = process.argv.slice(2)

if (!cartellaPng || !idCapo || !["colore", "verde"].includes(modoScelto)) {
  console.error(
    'Uso: node scripts/converti-turntable.mjs "<cartella-png>" <id-capo> [colore|verde]',
  )
  process.exit(1)
}

const cartellaUscita = path.join("public", "images", "moda", idCapo, "turntable")
const cartellaHd = `${cartellaUscita}_hd` // versione HD per lo zoom
await mkdir(cartellaUscita, { recursive: true })
await mkdir(cartellaHd, { recursive: true })

/* ------------------------------------------------------------
 * FUNZIONI
 * ------------------------------------------------------------ */

/* Numero del fotogramma: cifre finali prima di ".png" ("00_12.png" → 12) */
const numeroFotogramma = (nome) => Number(nome.match(/(\d+)\.png$/i)?.[1] ?? -1)

/* Legge un PNG come pixel grezzi RGBA (4 valori per pixel) */
const leggiRgba = (percorso) =>
  sharp(percorso).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

/* Colore e alfa medi dei quattro angoli del primo fotogramma.
   Restituisce null se gli angoli sono già trasparenti: PNG senza sfondo */
async function misuraSfondo(percorso) {
  const { data, info } = await leggiRgba(percorso)
  const L = LATO_ANGOLO
  const angoli = [
    [0, 0],
    [info.width - L, 0],
    [0, info.height - L],
    [info.width - L, info.height - L],
  ]

  let r = 0, g = 0, b = 0, a = 0, n = 0
  for (const [x0, y0] of angoli) {
    for (let y = y0; y < y0 + L; y++) {
      for (let x = x0; x < x0 + L; x++) {
        const i = (y * info.width + x) * 4
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        a += data[i + 3]
        n++
      }
    }
  }

  if (a / n < ALFA_VISIBILE) return null
  return [r / n, g / n, b / n]
}

/* Rettangolo che contiene i pixel visibili */
function rettangoloDiAlfa(data, info) {
  let minX = info.width, minY = info.height, maxX = -1, maxY = -1
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > ALFA_VISIBILE) {
      const pixel = (i - 3) / 4
      const x = pixel % info.width
      const y = Math.floor(pixel / info.width)
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return { minX, minY, maxX, maxY }
}

/* Alfa di un pixel (0–255) secondo il modo scelto */
function alfaDi(r, g, b, sfondo, modo) {
  let t
  if (modo === "verde") {
    // Quanto il pixel è "più verde" del suo rosso e del suo blu:
    // uno sfondo verde, chiaro o scuro, lo è sempre; un tessuto neutro no
    const eccesso = g - Math.max(r, b)
    t = 1 - (eccesso - ECCESSO_CAPO) / (ECCESSO_SFONDO - ECCESSO_CAPO)
  } else {
    // Quanto il pixel è lontano dal colore dello sfondo
    const [sr, sg, sb] = sfondo
    const distanza = Math.hypot(r - sr, g - sg, b - sb)
    t = (distanza - DISTANZA_SFONDO) / (DISTANZA_CAPO - DISTANZA_SFONDO)
  }
  return Math.round(255 * Math.min(Math.max(t, 0), 1))
}

/* Scontorno + despill di un fotogramma.
   Con sfondo null (PNG già trasparente) tiene l'alfa originale. */
async function scontorna(percorso, sfondo, modo) {
  const { data, info } = await leggiRgba(percorso)

  if (sfondo === null) {
    return { data, info, rettangolo: rettangoloDiAlfa(data, info) }
  }

  const [sr, sg, sb] = sfondo

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]

    // L'alfa calcolata non può superare quella originale del file
    const alfa = Math.min(alfaDi(r, g, b, sfondo, modo), data[i + 3])
    data[i + 3] = alfa

    // Despill sui bordi: un pixel di bordo è un miscuglio di capo e
    // sfondo; togliendo la parte di sfondo resta il colore del capo.
    // In modo verde lo sfondo è sfumato, quindi basta il limitatore sotto.
    if (modo === "colore" && alfa > 0 && alfa < 255) {
      const a = alfa / 255
      const pulisci = (c, s) =>
        Math.round(Math.min(255, Math.max(0, (c - s * (1 - a)) / a)))
      data[i] = pulisci(r, sr)
      data[i + 1] = pulisci(g, sg)
      data[i + 2] = pulisci(b, sb)
    }

    // Limitatore del verde: toglie la luce verde che uno sfondo verde
    // riflette sul tessuto. Sui colori neutri non cambia nulla.
    // Solo se lo sfondo è verde: con altri sfondi non serve.
    const sfondoVerde = modo === "verde" || sg > Math.max(sr, sb) + 40
    if (sfondoVerde && alfa > 0) {
      const tetto = Math.max(data[i], data[i + 2])
      if (data[i + 1] > tetto) data[i + 1] = tetto
    }
  }

  return { data, info, rettangolo: rettangoloDiAlfa(data, info) }
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

// Tipo di render, deciso sul primo fotogramma
const sfondo = await misuraSfondo(path.join(cartellaPng, file[0]))
if (sfondo === null) {
  console.log("PNG già trasparenti: nessuno scontorno, solo ritaglio")
} else if (modoScelto === "verde") {
  console.log("Modo verde: sfondo verde, anche sfumato")
} else {
  console.log(`Sfondo a tinta unita: RGB(${sfondo.map(Math.round).join(", ")})`)
}

// Passo 1: scontorna tutti i fotogrammi e calcola il rettangolo comune
const scontornati = []
const comune = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 }

for (const nome of file) {
  const risultato = await scontorna(path.join(cartellaPng, nome), sfondo, modoScelto)
  scontornati.push(risultato)

  const r = risultato.rettangolo
  if (r.maxX < 0) continue // fotogramma vuoto: non allarga il rettangolo
  comune.minX = Math.min(comune.minX, r.minX)
  comune.minY = Math.min(comune.minY, r.minY)
  comune.maxX = Math.max(comune.maxX, r.maxX)
  comune.maxY = Math.max(comune.maxY, r.maxY)
}

if (comune.maxX < 0) {
  console.error("Nessun capo trovato: tutti i pixel sono stati presi per sfondo.")
  console.error("Prova ad abbassare DISTANZA_CAPO (o ECCESSO_CAPO in modo verde).")
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

// Avviso: se il ritaglio è grande quanto l'immagine, lo sfondo non è
// stato tolto (modo sbagliato o soglie da regolare)
if (ritaglio.width >= W - 2 && ritaglio.height >= H - 2) {
  console.warn(
    "⚠ Il ritaglio è grande quanto l'immagine: lo sfondo potrebbe non essere stato tolto.",
  )
  console.warn('  Sfondo verde sfumato? Rilancia aggiungendo "verde" in fondo al comando.')
}

// Passo 2: ritaglia tutti allo stesso modo e salva le due versioni
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

// Riepilogo
const mb = (byte) => (byte / 1024 / 1024).toFixed(1)
console.log(`\n${file.length} fotogrammi in ${cartellaUscita} e ${cartellaHd}`)
console.log(`Ritaglio comune: ${ritaglio.width}×${ritaglio.height} px (originale ${W}×${H})`)
console.log(`Peso: ${mb(pesoPrima)} MB → ${mb(pesoDopo)} MB`)
console.log(`Versione HD (caricata solo con lo zoom): ${mb(pesoHd)} MB`)
