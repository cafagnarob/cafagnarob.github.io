/*
 * Azioni della scena (thunk)
 * Le azioni "complete" che i componenti chiamano: aggiornano lo stato
 * con le azioni dello slice e poi eseguono gli effetti (camera,
 * precaricamento dei render). Un thunk è una funzione che riceve
 * dispatch: si usa con dispatch(apriArmadio()).
 *
 * Capo CON turntable (nessun modello 3D in volo):
 *   apertura armadio → precarica i render di tutti i capi
 *   click sul capo   → selezionaCapo: il capo 3D si nasconde e al suo
 *                      posto il render vola al centro (VisoreTurntable)
 *   click in vetrina → il render torna nel punto di partenza, poi
 *                      chiudiVetrina: il capo 3D riappare lì
 * Capo SENZA turntable: ispezione 3D (click sul capo per riporlo).
 */

import * as THREE from "three"
import { type NomeVista } from "../config/camera"
import { LAVORI_MODA } from "../data/lavoriModa"
import { precaricaTurntable } from "../utils/turntable"
import { liberaLimiti, vaiAllaVista } from "../components/scena/regiaCamera"
import {
  bloccaCamera,
  controlliCamera,
} from "../components/scena/controlliCamera"
import type { Rettangolo } from "../utils/rettangoloSchermo"
import {
  accensioneSchermo,
  cambioVista,
  chiusuraVetrina,
  fineRitornoCapo,
  ingressoSchermo,
  inizioRitornoCapo,
  selezioneCapo,
  spegnimentoSchermo,
} from "./sliceScena"
import type { AppThunk } from "./store"
import { vistaPer, vistaPerDispositivo } from "../components/scena/viste"
import type { NomeSchermo } from "../config/schermi"
import { meshSchermo, posaPerSchermo } from "../components/scena/schermi"

/* --- Viste --- */
/* Sposta la camera su una vista e la rende attiva.
   Una vista senza coordinate non cambia nulla (avviso in console). */
export const vaiA =
  (nome: NomeVista): AppThunk =>
  (dispatch) => {
    const effettiva = vistaPerDispositivo(nome)
    const vista = vistaPer(effettiva)
    if (!vista) {
      console.warn(
        `Vista "${effettiva}" non trovata: mancano gli empty in Blender?`,
      )
      return
    }
    dispatch(cambioVista(effettiva))
    vaiAllaVista(controlliCamera(), vista)
  }

/* --- Armadio --- */
export const apriArmadio = (): AppThunk => (dispatch, getState) => {
  // Da un'altra vista il clic sull'armadio vale come "clic fuori"
  if (getState().scena.vista !== "panoramica") {
    dispatch(esci())
    return
  }
  dispatch(vaiA("armadio"))
  // Il primo fotogramma serve nell'istante del click: si scaricano ora
  for (const { turntable } of Object.values(LAVORI_MODA)) {
    if (turntable) precaricaTurntable(turntable)
  }
}

export const chiudiArmadio = (): AppThunk => esci()

/* --- Capo --- */
export const selezionaCapo =
  (idLavoro: string, rettangolo: Rettangolo): AppThunk =>
  (dispatch) => {
    const conTurntable = Boolean(LAVORI_MODA[idLavoro]?.turntable)
    dispatch(
      selezioneCapo({
        idLavoro,
        partenzaVetrina: conTurntable ? rettangolo : null,
      }),
    )
    bloccaCamera(true)
  }

/* Ispezione 3D (capi senza turntable) */
export const rimettiCapo = (): AppThunk => (dispatch) => {
  dispatch(inizioRitornoCapo())
}

export const completaRitornoCapo = (): AppThunk => (dispatch) => {
  dispatch(fineRitornoCapo())
  bloccaCamera(false)
}

/* Vetrina (capi con turntable): il render è tornato al suo posto */
export const chiudiVetrina = (): AppThunk => (dispatch) => {
  dispatch(chiusuraVetrina())
  bloccaCamera(false)
}

/* --- Uscita --- */
/* Torna alla panoramica da qualsiasi vista (Esc, clic fuori, "←").
   Con un capo in ispezione non fa nulla: lì si esce dal capo. */
export const esci = (): AppThunk => (dispatch, getState) => {
  const { vista, schermo, capoInIspezione } = getState().scena

  // 1° livello: dallo schermo si torna alla vista pc / telefono
  if (schermo) {
    dispatch(spegnimentoSchermo())
    bloccaCamera(false)
    dispatch(vaiA(vista))
    return
  }

  // 2° livello: dalla vista alla panoramica
  if (vista === "panoramica" || capoInIspezione) return
  dispatch(vaiA("panoramica"))
}

/* --- Schermi --- */
/* La camera entra nello schermo; a fine movimento si accende l'interfaccia.
   setLookAt restituisce una Promise che si risolve a movimento finito. */
export const accendiSchermo =
  (nome: NomeSchermo): AppThunk =>
  async (dispatch, getState) => {
    const controlli = controlliCamera()
    const m = meshSchermo(nome)
    if (
      !controlli ||
      !m ||
      !(controlli.camera instanceof THREE.PerspectiveCamera)
    )
      return

    const posa = posaPerSchermo(nome, m, controlli.camera)
    dispatch(ingressoSchermo(nome))
    bloccaCamera(true)
    liberaLimiti(controlli)
    await controlli.setLookAt(...posa.posizione, ...posa.obiettivo, true)

    // L'utente potrebbe essere uscito durante il movimento (Esc)
    if (getState().scena.schermo?.nome === nome) dispatch(accensioneSchermo())
  }
