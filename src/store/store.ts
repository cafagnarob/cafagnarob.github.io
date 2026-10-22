/*
 * Store Redux dell'app
 * Riunisce gli slice (per ora solo "scena"; poi arriverà "audio")
 * ed esporta i tipi che servono agli hook e ai thunk.
 *
 * - RootState: la forma di tutto lo stato, ricavata dai reducer.
 * - AppThunk: tipo delle azioni con effetti (azioniScena.ts).
 *   configureStore include già il supporto ai thunk.
 * - store.getState() si può usare anche dentro useFrame, per leggere
 *   lo stato a ogni fotogramma senza provocare re-render.
 */
import {
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from "@reduxjs/toolkit"
import scenaReducer from "./sliceScena"

export const store = configureStore({
  reducer: {
    scena: scenaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>
