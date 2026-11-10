/*
 * Viste della stanza
 * Raccoglie le viste della camera dagli empty del modello della stanza:
 *   "vista_letto"  → posizione della camera
 *   "guarda_letto" → punto guardato
 * e le tiene in un elenco consultato dai thunk (vistaPer).
 *
 * - Si parte dalle VISTE_PREDEFINITE; gli empty le completano o le
 *   sostituiscono (es. "vista_panoramica" vince sul valore del file).
 * - Le posizioni sono quelle NEL MONDO (getWorldPosition): valgono
 *   anche se l'empty è figlio di un altro oggetto.
 * - Gli errori di nome (coppia incompleta, vista sconosciuta) vengono
 *   segnalati in console invece di fallire in silenzio.
 * - Non sta nello store: sono dati fissi letti dal file, nello store
 *   va solo il NOME della vista attiva.
 */
import * as THREE from "three"
import {
  NOMI_VISTE,
  PREFISSO_OBIETTIVO,
  PREFISSO_POSIZIONE,
  VISTE_PREDEFINITE,
  VISTE_TOUCH,
  type NomeVista,
  type VistaCamera,
} from "../../config/camera"
import { eTouch } from "../../utils/dispositivo"

type Punto = VistaCamera["posizione"]

const viste: Partial<Record<NomeVista, VistaCamera>> = { ...VISTE_PREDEFINITE }

const eNomeVista = (nome: string): nome is NomeVista =>
  (NOMI_VISTE as readonly string[]).includes(nome)

const posizioneNelMondo = (oggetto: THREE.Object3D): Punto => {
  const p = oggetto.getWorldPosition(new THREE.Vector3())
  return [p.x, p.y, p.z]
}

/* Legge gli empty dalla scena caricata (si può chiamare più volte) */
export function registraVisteDaScena(scena: THREE.Object3D) {
  scena.updateMatrixWorld(true)

  const posizioni = new Map<string, Punto>()
  const obiettivi = new Map<string, Punto>()
  scena.traverse((oggetto) => {
    if (oggetto.name.startsWith(PREFISSO_POSIZIONE)) {
      posizioni.set(
        oggetto.name.slice(PREFISSO_POSIZIONE.length),
        posizioneNelMondo(oggetto),
      )
    } else if (oggetto.name.startsWith(PREFISSO_OBIETTIVO)) {
      obiettivi.set(
        oggetto.name.slice(PREFISSO_OBIETTIVO.length),
        posizioneNelMondo(oggetto),
      )
    }
  })

  for (const [nome, posizione] of posizioni) {
    const obiettivo = obiettivi.get(nome)
    if (!obiettivo) console.warn(`Viste: manca "${PREFISSO_OBIETTIVO}${nome}"`)
    else if (!eNomeVista(nome))
      console.warn(`Viste: "${nome}" non è in NOMI_VISTE`)
    else viste[nome] = { posizione, obiettivo }
  }
  for (const nome of obiettivi.keys()) {
    if (!posizioni.has(nome))
      console.warn(`Viste: manca "${PREFISSO_POSIZIONE}${nome}"`)
  }

  if (import.meta.env.DEV)
    console.info("Viste disponibili:", Object.keys(viste))
}

export function vistaPer(nome: NomeVista): VistaCamera | undefined {
  return viste[nome]
}

/* Vista da usare davvero su questo dispositivo (es. "pc" → "telefono" su touch) */
export function vistaPerDispositivo(nome: NomeVista): NomeVista {
  return (eTouch() && VISTE_TOUCH[nome]) || nome
}
