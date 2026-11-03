/*
 * Motore dello spettro
 * Un solo ciclo requestAnimationFrame per tutti gli spettri del sito
 * (pannello chiuso e aperto, desktop o mobile):
 * 1. legge l'analisi UNA volta per fotogramma (bande e/o canali)
 * 2. per ogni colonna avvicina il livello mostrato a quello misurato:
 *    salita in ATTACCO_MS, discesa in RILASCIO_MS (11 livelli), sul
 *    tempo reale tra due fotogrammi: uguale a 60 e a 120 Hz
 * 3. scrive --livello sulla colonna SOLO quando cambia: il CSS accende
 *    i LED (niente render React a ogni fotogramma)
 * Il ciclo parte con il primo spettro registrato e si ferma con
 * l'ultimo. Con prefers-reduced-motion: niente animazione, i livelli
 * saltano al valore misurato ogni PASSO_RIDOTTO_MS.
 */
import { leggiBande, leggiCanali } from "../../../audio/analisi"
import { livelloPrincipaleAttuale } from "../../../audio/contesto"
import {
  ATTACCO_MS,
  LIVELLI,
  PASSO_RIDOTTO_MS,
  RILASCIO_MS,
  RILASCIO_MUTO_MS,
  VARIANTI_PANNELLO,
  livelloDa,
  type VariantePannello,
} from "../../../config/pannelloAudio"

type Spettro = {
  colonne: HTMLElement[]
  variante: VariantePannello
  livelli: Float32Array // livello mostrato, con i decimali
  scritti: Int8Array // ultimo --livello scritto (-1 = mai)
}

const registrati = new Set<Spettro>()
const bande = new Uint8Array(VARIANTI_PANNELLO.desktop.colonne)
const canali = new Uint8Array(VARIANTI_PANNELLO.mobile.colonne)
const movimentoRidotto = window.matchMedia("(prefers-reduced-motion: reduce)")

let richiesta = 0
let precedente = 0
let ultimoAggiornamento = 0

export function registraSpettro(
  colonne: HTMLElement[],
  variante: VariantePannello,
) {
  const spettro: Spettro = {
    colonne,
    variante,
    livelli: new Float32Array(colonne.length),
    scritti: new Int8Array(colonne.length).fill(-1),
  }
  registrati.add(spettro)
  if (!richiesta) richiesta = requestAnimationFrame(ciclo)

  return () => {
    registrati.delete(spettro)
    if (registrati.size === 0) {
      cancelAnimationFrame(richiesta)
      richiesta = 0
      precedente = 0
    }
  }
}

function ciclo(ora: number) {
  richiesta = requestAnimationFrame(ciclo)

  // Tempo dal fotogramma precedente; limitato dopo una scheda in pausa
  const dt = precedente ? Math.min(ora - precedente, 100) : 16
  precedente = ora

  const ridotto = movimentoRidotto.matches
  if (ridotto && ora - ultimoAggiornamento < PASSO_RIDOTTO_MS) return
  ultimoAggiornamento = ora

  // Leggi solo ciò che serve agli spettri presenti
  let servonoBande = false
  let servonoCanali = false
  for (const s of registrati) {
    if (s.variante === "desktop") servonoBande = true
    else servonoCanali = true
  }
  if (servonoBande) leggiBande(bande)
  if (servonoCanali) leggiCanali(canali)

  const salita = (dt * LIVELLI) / ATTACCO_MS
  // Con il muto la discesa è più lenta: i LED "si spengono" piano
  const rilascio =
    livelloPrincipaleAttuale() === 0 ? RILASCIO_MUTO_MS : RILASCIO_MS
  const discesa = (dt * LIVELLI) / rilascio

  for (const s of registrati) {
    const valori = s.variante === "desktop" ? bande : canali
    s.colonne.forEach((colonna, i) => {
      const obiettivo = livelloDa(valori[i])
      let livello = s.livelli[i]
      if (ridotto) livello = obiettivo
      else if (obiettivo > livello)
        livello = Math.min(obiettivo, livello + salita)
      else livello = Math.max(obiettivo, livello - discesa)
      s.livelli[i] = livello

      const intero = Math.round(livello)
      if (intero !== s.scritti[i]) {
        s.scritti[i] = intero
        colonna.style.setProperty("--livello", String(intero))
      }
    })
  }
}
