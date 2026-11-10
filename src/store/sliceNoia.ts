/*
 * Slice NOIA
 * Ricorda quale scheda della finestra NOIA è aperta.
 * - scheda = null  → finestra chiusa
 * - scheda = "fw22" → finestra aperta sulla collezione FW22-23
 * Sta in Redux (e non in uno useState del desktop) perché la finestra
 * si apre da due punti lontani: la cartella sul desktop del PC e il
 * link "Scopri NOIA →" del cartellino nell'armadio.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IdScheda } from "../data/noia"

type StatoNoia = { scheda: IdScheda | null }

const statoIniziale: StatoNoia = { scheda: null }

const sliceNoia = createSlice({
  name: "noia",
  initialState: statoIniziale,
  reducers: {
    /** Apre la finestra (o cambia scheda, se è già aperta) */
    apriNoia(stato, azione: PayloadAction<IdScheda>) {
      stato.scheda = azione.payload
    },
    chiudiNoia(stato) {
      stato.scheda = null
    },
  },
})

export const { apriNoia, chiudiNoia } = sliceNoia.actions
export default sliceNoia.reducer
