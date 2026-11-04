/*
 * Azioni dell'audio (thunk)
 *
 * alternaDisco: play/stop del giradischi.
 * - Play: il vinile parte subito, il braccio si muove per
 *   DURATA_BRACCIO_S; la musica parte allo scadere (puntina sul disco).
 *   Se il volume è a zero (o in muto) e alzaVolume è vero (clic sul
 *   giradischi), in quel momento il volume sale da 0 a VOLUME_AVVIO.
 * - Stop: la musica sfuma subito, poi braccio e vinile si fermano.
 * - Il timer viene sempre annullato: con clic rapidi la musica non
 *   parte se nel frattempo è stato premuto stop.
 *
 * impostaVolume: cambia il volume; se passa da 0 a più di 0 con il
 * disco fermo, avvia il giradischi (senza salita: il volume lo sta
 * scegliendo l'utente). Ferma un'eventuale salita automatica in corso:
 * l'utente ha sempre la precedenza.
 *
 * salitaVolume: porta il volume da 0 a VOLUME_AVVIO aggiornando lo
 * store a ogni fotogramma, così la manopola si vede girare.
 *
 * L'audio va preparato DENTRO un gesto dell'utente: i browser sbloccano
 * il suono solo in risposta a un'azione (clic, tocco, tasto).
 */
import { avviaMusica, fermaMusica, preparaMusica } from "../audio/musica"
import { impostaLivelloPrincipale } from "../audio/contesto"
import {
  DURATA_BRACCIO_S,
  DURATA_SALITA_VOLUME_S,
  VOLUME_AVVIO,
} from "../config/giradischi"
import {
  alternanzaMuto,
  arrestoDisco,
  avvioDisco,
  cambioVolume,
} from "./sliceAudio"
import type { AppThunk, RootState } from "./store"

let timerMusica: number | undefined
let salita = 0 // requestAnimationFrame della salita del volume (0 = nessuna)

/* Applica muto e volume al suono.
   volume² = volume percepito in modo naturale dall'orecchio. */
function applicaVolume(stato: RootState) {
  const { muto, volume } = stato.audio
  impostaLivelloPrincipale(muto ? 0 : volume ** 2)
}

function fermaSalita() {
  cancelAnimationFrame(salita)
  salita = 0
}

/* Salita del volume da 0 a VOLUME_AVVIO, con rallentamento finale
   (ease-out: t·(2 − t)). cambioVolume sopra 0 toglie anche il muto. */
const salitaVolume = (): AppThunk => (dispatch, getState) => {
  fermaSalita()
  const inizio = performance.now()

  const passo = (ora: number) => {
    const t = Math.min(1, (ora - inizio) / (DURATA_SALITA_VOLUME_S * 1000))
    dispatch(cambioVolume(VOLUME_AVVIO * t * (2 - t)))
    applicaVolume(getState())
    salita = t < 1 ? requestAnimationFrame(passo) : 0
  }

  salita = requestAnimationFrame(passo)
}

type OpzioniDisco = { alzaVolume?: boolean }

export const alternaDisco =
  ({ alzaVolume = true }: OpzioniDisco = {}): AppThunk =>
  (dispatch, getState) => {
    window.clearTimeout(timerMusica)

    if (getState().audio.discoInRiproduzione) {
      fermaSalita()
      dispatch(arrestoDisco())
      fermaMusica()
      return
    }

    // Deciso ORA, al clic: se il volume è a zero, alla puntina salirà
    const { volume, muto } = getState().audio
    const daAlzare = alzaVolume && (volume === 0 || muto)

    dispatch(avvioDisco())
    preparaMusica()
    timerMusica = window.setTimeout(() => {
      avviaMusica()
      if (daAlzare) dispatch(salitaVolume())
    }, DURATA_BRACCIO_S * 1000)
  }

export const impostaVolume =
  (volume: number): AppThunk =>
  (dispatch, getState) => {
    fermaSalita() // l'utente ha la precedenza sulla salita automatica
    const prima = getState().audio.volume

    dispatch(cambioVolume(volume))
    applicaVolume(getState())

    // Da silenzio a suono, con il disco fermo: parte il giradischi
    if (prima === 0 && volume > 0 && !getState().audio.discoInRiproduzione) {
      dispatch(alternaDisco({ alzaVolume: false }))
    }
  }

export const alternaMuto = (): AppThunk => (dispatch, getState) => {
  dispatch(alternanzaMuto())
  applicaVolume(getState())
}

/* All'avvio: il master parte dal volume iniziale (0, silenzio) */
export const inizializzaAudio = (): AppThunk => (_, getState) => {
  applicaVolume(getState())
}
