/*
 * Azioni dell'audio (thunk)
 * alternaDisco: play/stop del giradischi.
 * - Play: il vinile parte subito, il braccio si muove per
 *   DURATA_BRACCIO_S; la musica parte allo scadere (puntina sul disco).
 * - Stop: la musica sfuma subito, poi braccio e vinile si fermano.
 * - Il timer viene sempre annullato: con clic rapidi la musica non
 *   parte se nel frattempo è stato premuto stop.
 * L'audio va preparato DENTRO il clic: i browser sbloccano il suono
 * solo in risposta a un'azione dell'utente.
 */

import { avviaMusica, fermaMusica, preparaMusica } from "../audio/musica"
import { DURATA_BRACCIO_S } from "../config/giradischi"
import {
  alternanzaMuto,
  arrestoDisco,
  avvioDisco,
  cambioVolume,
} from "./sliceAudio"
import type { AppThunk, RootState } from "./store"
import { impostaLivelloPrincipale } from "../audio/contesto"
import { salvaPreferenzeAudio } from "../utils/preferenze"

let timerMusica: number | undefined

export const alternaDisco = (): AppThunk => (dispatch, getState) => {
  window.clearTimeout(timerMusica)

  if (getState().audio.discoInRiproduzione) {
    dispatch(arrestoDisco())
    fermaMusica()
    return
  }

  dispatch(avvioDisco())
  preparaMusica()
  timerMusica = window.setTimeout(avviaMusica, DURATA_BRACCIO_S * 1000)
}

/* Applica muto e volume al suono e li salva.
   volume² = volume percepito in modo naturale dall'orecchio. */
function applicaVolume(stato: RootState) {
  const { muto, volume } = stato.audio
  impostaLivelloPrincipale(muto ? 0 : volume ** 2)
  salvaPreferenzeAudio({ muto, volume })
}

export const impostaVolume =
  (volume: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(cambioVolume(volume))
    applicaVolume(getState())
  }

export const alternaMuto = (): AppThunk => (dispatch, getState) => {
  dispatch(alternanzaMuto())
  applicaVolume(getState())
}

/* All'avvio: applica le preferenze lette dal browser */
export const inizializzaAudio = (): AppThunk => (_, getState) => {
  applicaVolume(getState())
}
