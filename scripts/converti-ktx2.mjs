/*
 * Converte i PNG delle texture in KTX2 (compressi anche nella scheda video)
 * Uso:  node scripts/converti-ktx2.mjs          (solo i PNG nuovi o modificati)
 *       node scripts/converti-ktx2.mjs --forza  (tutti)
 *
 * - Per ogni PNG nelle CARTELLE crea il .ktx2 accanto, con lo stesso nome.
 * - Codifica ETC1S (basis-lz): file piccoli. Per le texture in UASTC
 *   (qualità quasi uguale al PNG, file più grandi) aggiungi il nome del
 *   file a UASTC: serve dove l'ETC1S mostra "fasce" nelle sfumature.
 * - Mipmap generate nel file; spazio colore sRGB (come i PNG); origine
 *   in alto a sinistra (convenzione glTF, come flipY = false nel codice).
 * - Salta i PNG che hanno già un .ktx2 più recente: riconvertire tutto
 *   ogni volta è lento.
 * - Alla fine stampa il peso prima e dopo.
 * Richiede il comando "ktx" di KTX-Software nel PATH.
 * Salta (con un avviso) i PNG con lati che non sono potenze di due.
 */
import { execFileSync } from "node:child_process"
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs"
import path from "node:path"

const CARTELLE = ["public/textures/stanza", "public/textures/armadio"]

/* Texture in UASTC (nomi dei PNG) */
const UASTC = new Set([
  // 'stanza_base.png',
])

const FORZA = process.argv.includes("--forza")

const COMUNI = [
  "--format",
  "R8G8B8_SRGB",
  "--generate-mipmap",
  "--assign-tf",
  "srgb",
  "--assign-texcoord-origin",
  "top-left",
]
const ETC1S = ["--encode", "basis-lz", "--clevel", "2", "--qlevel", "255"]
const UASTC_OPZIONI = [
  "--encode",
  "uastc-ldr-4x4",
  "--uastc-quality",
  "2",
  "--zstd",
  "18",
]

const mb = (byte) => (byte / 1024 / 1024).toFixed(2)

/* Larghezza e altezza di un PNG, lette dall'intestazione (byte 16–23) */
function dimensioniPng(file) {
  const intestazione = readFileSync(file).subarray(0, 24)
  return {
    larghezza: intestazione.readUInt32BE(16),
    altezza: intestazione.readUInt32BE(20),
  }
}

/* Le texture compresse con mipmap richiedono lati potenza di due
   (512, 1024, 2048…): con altre misure WebGL le rifiuta */
const potenzaDiDue = (n) => n > 0 && (n & (n - 1)) === 0

let totalePng = 0
let totaleKtx2 = 0

for (const cartella of CARTELLE) {
  for (const nome of readdirSync(cartella).filter((f) =>
    f.toLowerCase().endsWith(".png"),
  )) {
    const png = path.join(cartella, nome)
    const ktx2 = png.replace(/\.png$/i, ".ktx2")
    const { larghezza, altezza } = dimensioniPng(png)
    if (!potenzaDiDue(larghezza) || !potenzaDiDue(altezza)) {
      console.log(
        `⚠ ${nome}: ${larghezza}×${altezza} non è una potenza di due, saltato (ridimensionala, es. 2048×1024)`,
      )
      continue
    }
    const pesoPng = statSync(png).size
    totalePng += pesoPng

    const aggiornato =
      existsSync(ktx2) && statSync(ktx2).mtimeMs > statSync(png).mtimeMs
    if (aggiornato && !FORZA) {
      totaleKtx2 += statSync(ktx2).size
      continue
    }

    const codifica = UASTC.has(nome) ? UASTC_OPZIONI : ETC1S
    try {
      execFileSync("ktx", ["create", ...COMUNI, ...codifica, png, ktx2], {
        stdio: "pipe",
      })
      const pesoKtx2 = statSync(ktx2).size
      totaleKtx2 += pesoKtx2
      const tipo = UASTC.has(nome) ? "UASTC" : "ETC1S"
      console.log(
        `✔ ${nome}  ${mb(pesoPng)} MB → ${mb(pesoKtx2)} MB  (${tipo})`,
      )
    } catch (errore) {
      console.log(
        `✖ ${nome}: ${errore.stderr?.toString().trim() || errore.message}`,
      )
    }
  }
}

console.log(`\nTotale: PNG ${mb(totalePng)} MB → KTX2 ${mb(totaleKtx2)} MB`)
