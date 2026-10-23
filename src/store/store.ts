/*
 * Store Redux dell'app
 * Riunisce gli slice ed esporta i tipi che servono agli hook e ai thunk.
 *
 * - scena: viste, schermi, armadio, capi e vetrina
 * - audio: giradischi, muto e volume
 * - RootState: la forma di tutto lo stato, ricavata dai reducer
 *   (aggiungendo uno slice qui, il tipo si aggiorna da solo).
 * - AppThunk: tipo delle azioni con effetti (azioniScena, azioniAudio).
 * - store.getState() si può usare anche dentro useFrame, per leggere
 *   lo stato a ogni fotogramma senza provocare re-render.
 */
import {
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from "@reduxjs/toolkit"
import scenaReducer from "./sliceScena"
import audioReducer from "./sliceAudio"

export const store = configureStore({
  reducer: {
    scena: scenaReducer,
    audio: audioReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>
