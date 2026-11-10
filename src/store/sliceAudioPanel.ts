/*
 * Slice Audio Panel
 * Ricorda se la finestra del caso studio Audio Panel è aperta.
 * In Redux perché si apre da due punti: la cartella sul desktop del PC
 * e l'app sul telefono.
 */
import { createSlice } from "@reduxjs/toolkit"

const sliceAudioPanel = createSlice({
  name: "audioPanel",
  initialState: { aperta: false },
  reducers: {
    apriAudioPanel(stato) {
      stato.aperta = true
    },
    chiudiAudioPanel(stato) {
      stato.aperta = false
    },
  },
})

export const { apriAudioPanel, chiudiAudioPanel } = sliceAudioPanel.actions
export default sliceAudioPanel.reducer
