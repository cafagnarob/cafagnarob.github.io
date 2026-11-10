/*
 * Slice dell'audio
 * - discoInRiproduzione: il giradischi sta suonando (braccio sul disco,
 *   vinile in rotazione). Resta vero anche cambiando vista.
 * - muto / volume (0–1): impostazioni di tutto il sito, lette all'avvio
 *   dalle preferenze salvate nel browser.
 * I reducer cambiano solo lo stato: applicare il volume al suono e
 * salvare le preferenze sono effetti, fatti dai thunk (azioniAudio.ts).
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type StatoAudio = {
  discoInRiproduzione: boolean
  muto: boolean
  volume: number
}

const statoIniziale: StatoAudio = {
  discoInRiproduzione: false,
  muto: false,
  volume: 0,
}

const sliceAudio = createSlice({
  name: "audio",
  initialState: statoIniziale,
  reducers: {
    avvioDisco(stato) {
      stato.discoInRiproduzione = true
    },
    arrestoDisco(stato) {
      stato.discoInRiproduzione = false
    },
    cambioVolume(stato, azione: PayloadAction<number>) {
      stato.volume = Math.min(1, Math.max(0, azione.payload))
      // Alzare il volume toglie il muto
      if (stato.volume > 0) stato.muto = false
    },
    alternanzaMuto(stato) {
      stato.muto = !stato.muto
      // Togliere il muto con il volume a zero non farebbe sentire nulla
      if (!stato.muto && stato.volume === 0) stato.volume = 0.5
    },
  },
})

export const { avvioDisco, arrestoDisco, cambioVolume, alternanzaMuto } =
  sliceAudio.actions
export default sliceAudio.reducer
