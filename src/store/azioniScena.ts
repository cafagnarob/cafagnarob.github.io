/*
 * Azioni della scena (thunk)
 * Le azioni "complete" che i componenti chiamano: aggiornano lo stato
 * con le azioni dello slice e poi eseguono gli effetti (camera, audio,
 * precaricamento dei render). Un thunk è una funzione che riceve
 * dispatch: si usa con dispatch(apriArmadio()).
 *
 * Ingresso e uscita:
 *   "Entra" → dentro la stanza, l'audio viene sbloccato (in silenzio)
 *   "Exit"  → di nuovo davanti alla porta: camera in panoramica, disco
 *             fermo
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
import type { NomeVista } from "../config/camera"
import type { NomeSchermo } from "../config/schermi"
import { LAVORI_MODA } from "../data/lavoriModa"
import { precaricaTurntable } from "../utils/turntable"
import type { Rettangolo } from "../utils/rettangoloSchermo"
import { sbloccaAudio } from "../audio/contesto"
import {
  impostaSpazioModale,
  liberaLimiti,
  vaiAllaVista,
} from "../components/scena/regiaCamera"
import {
  bloccaCamera,
  controlliCamera,
} from "../components/scena/controlliCamera"
import { vistaPer, vistaPerDispositivo } from "../components/scena/viste"
import { meshSchermo, posaPerSchermo } from "../components/scena/schermi"
import { adattaAlloSchermo } from "../components/scena/adattamento"
import {
  accensioneSchermo,
  arrivoVista,
  cambioVista,
  chiusuraVetrina,
  fineRitornoCapo,
  ingresso,
  ingressoSchermo,
  inizioRitornoCapo,
  selezioneCapo,
  spegnimentoSchermo,
  uscitaDallaStanza,
} from "./sliceScena"
import { alternaDisco } from "./azioniAudio"
import type { AppThunk } from "./store"
import { VISTA_PROFILO } from "../config/profilo"
import { puntoFoto } from "../components/stanza/puntoFoto"

/* --- Ingresso e uscita --- */
/* Clic su "Entra": è un gesto dell'utente, quindi qui il browser
   permette di sbloccare l'audio. Il sito resta in silenzio finché non
   si alza il volume o si clicca il giradischi, ma il contesto audio è
   già pronto. */
export const entra = (): AppThunk => (dispatch) => {
  dispatch(ingresso())
  sbloccaAudio()
}

/* Clic sull'Exit: si torna davanti alla porta. La camera torna alla
   panoramica e il disco si ferma. */
export const esciDallaStanza = (): AppThunk => (dispatch, getState) => {
  const { scena, audio } = getState()
  if (scena.vista !== "panoramica") dispatch(vaiA("panoramica"))
  if (audio.discoInRiproduzione) dispatch(alternaDisco())
  dispatch(uscitaDallaStanza())
}

/* --- Viste --- */
/* Sposta la camera su una vista e la rende attiva. A movimento finito
   (camera e spostamento per il modale) segna la vista come raggiunta
   (arrivoVista): da lì, per esempio, si apre il modale del profilo.
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
    const adattata = adattaAlloSchermo(vista, effettiva)
    const controlli = controlliCamera()

    // Camera e spostamento per il modale partono insieme; quando sono
    // finiti entrambi, la vista è raggiunta (si apre, per esempio, il modale)
    void Promise.all([
      vaiAllaVista(controlli, adattata),
      impostaSpazioModale(
        controlli,
        effettiva === VISTA_PROFILO,
        adattata,
        puntoFoto(),
      ),
    ]).then(() => dispatch(arrivoVista(effettiva)))
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

/* --- Uscita dalle viste --- */
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

/* --- Ridimensionamento --- */
/* Lo schermo ha cambiato forma (rotazione del telefono, finestra
   ridimensionata): ricolloca la camera sulla vista attiva, senza
   animazione. Con lo schermo acceso ricalcola la posa dello schermo,
   perché la distanza "cover" dipende dalle proporzioni. */
export const riadatta = (): AppThunk => (_, getState) => {
  const controlli = controlliCamera()
  if (!controlli) return
  const { vista, schermo } = getState().scena

  if (schermo) {
    const m = meshSchermo(schermo.nome)
    if (!m || !(controlli.camera instanceof THREE.PerspectiveCamera)) return
    const posa = posaPerSchermo(schermo.nome, m, controlli.camera)
    void controlli.setLookAt(...posa.posizione, ...posa.obiettivo, false)
    return
  }

  const datiVista = vistaPer(vista)
  if (!datiVista) return
  const adattata = adattaAlloSchermo(datiVista, vista)
  // Senza animazione: la camera è subito al suo posto, nulla da aspettare
  void vaiAllaVista(controlli, adattata, false)
  void impostaSpazioModale(
    controlli,
    vista === VISTA_PROFILO,
    adattata,
    puntoFoto(),
    false,
  )
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
