/*
 * Nomi degli oggetti della stanza
 * three.js "pulisce" i nomi glTF (spazi → "_", punti tolti): qui i nomi
 * della configurazione, scritti come in Blender, vengono convertiti una
 * volta sola, così i confronti con oggetto.name coincidono.
 *
 * - NOMI: oggetti con materiali creati nel codice (vetri, foto, neon,
 *   città, vinile, braccio, schermi).
 * - VISTA_DI: oggetto cliccabile → vista che apre (es. "screen001" → "pc").
 *   La usano sia i materiali (alone per gruppo) sia i clic.
 */
import { OGGETTI_CLICCABILI, OGGETTI_SPECIALI } from "../../config/stanza"
import type { NomeVista } from "../../config/camera"
import { nomeGltf } from "../../utils/nomiGltf"
import { NOME_SCHERMO_PC } from "../../config/schermoPc"

export const NOMI = {
  vetroFinestra: nomeGltf(OGGETTI_SPECIALI.vetroFinestra),
  vetroFoto: nomeGltf(OGGETTI_SPECIALI.vetroFoto),
  foto: nomeGltf(OGGETTI_SPECIALI.foto),
  neon: nomeGltf(OGGETTI_SPECIALI.neon),
  citta: nomeGltf(OGGETTI_SPECIALI.citta),
  vinile: nomeGltf(OGGETTI_SPECIALI.vinile),
  braccio: nomeGltf(OGGETTI_SPECIALI.braccio),
  schermi: OGGETTI_SPECIALI.schermi.map(nomeGltf),
  schermoPc: nomeGltf(NOME_SCHERMO_PC), // "screen001": ha lo sfondo
}

export const VISTA_DI = new Map<string, NomeVista>(
  Object.entries(OGGETTI_CLICCABILI).map(([nome, vista]) => [
    nomeGltf(nome),
    vista,
  ]),
)
