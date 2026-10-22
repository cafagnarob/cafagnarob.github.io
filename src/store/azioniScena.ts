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
import { VISTE } from "../config/camera"
import { LAVORI_MODA } from "../data/lavoriModa"
import { precaricaTurntable } from "../utils/turntable"
import { vaiAllaVista } from "../components/scena/regiaCamera"
import {
  bloccaCamera,
  controlliCamera,
} from "../components/scena/controlliCamera"
import type { Rettangolo } from "../utils/rettangoloSchermo"
import {
  aperturaArmadio,
  chiusuraArmadio,
  chiusuraVetrina,
  fineRitornoCapo,
  inizioRitornoCapo,
  selezioneCapo,
} from "./sliceScena"
import type { AppThunk } from "./store"

/* --- Armadio --- */
export const apriArmadio = (): AppThunk => (dispatch) => {
  dispatch(aperturaArmadio())
  vaiAllaVista(controlliCamera(), VISTE.armadio)
  // Il primo fotogramma serve nell'istante del click: si scaricano ora
  for (const { turntable } of Object.values(LAVORI_MODA)) {
    if (turntable) precaricaTurntable(turntable)
  }
}

export const chiudiArmadio = (): AppThunk => (dispatch) => {
  dispatch(chiusuraArmadio())
  vaiAllaVista(controlliCamera(), VISTE.panoramica)
}

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
