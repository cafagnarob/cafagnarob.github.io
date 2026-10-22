/*
 * Slice della scena
 * Stato "discreto" della stanza: cambia solo quando l'utente fa qualcosa
 * (un clic), mai a ogni fotogramma. Le animazioni continue (ante, LED,
 * vinile) restano in ref e uniform dentro useFrame.
 *
 * Stato:
 * - armadioAperto: ante aperte, LED acceso
 * - capoInIspezione: id del lavoro in primo piano (o null)
 * - ritornoCapo: il capo 3D (senza turntable) sta tornando al suo posto
 * - partenzaVetrina: rettangolo a schermo del capo cliccato, punto di
 *   partenza del volo del render di CLO (null = vetrina chiusa)
 *
 * - Le azioni hanno nomi di EVENTO ("aperturaArmadio"): descrivono cosa
 *   è successo. Gli effetti (camera, precaricamento) sono nei thunk
 *   di azioniScena.ts, perché i reducer devono restare puri.
 * - Nei reducer si "modifica" lo stato direttamente: Redux Toolkit usa
 *   Immer, che crea dietro le quinte una copia nuova.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Rettangolo } from "../utils/rettangoloSchermo"
import type { NomeVista } from "../config/camera"

type StatoScena = {
  vista: NomeVista // vista attiva (armadio aperto = vista "armadio")
  capoInIspezione: string | null
  ritornoCapo: boolean
  partenzaVetrina: Rettangolo | null
}

const statoIniziale: StatoScena = {
  vista: "panoramica",
  capoInIspezione: null,
  ritornoCapo: false,
  partenzaVetrina: null,
}

const sliceScena = createSlice({
  name: "scena",
  initialState: statoIniziale,
  reducers: {
    cambioVista(stato, azione: PayloadAction<NomeVista>) {
      stato.vista = azione.payload
    },

    /* partenzaVetrina è null per i capi senza turntable (ispezione 3D) */
    selezioneCapo(
      stato,
      azione: PayloadAction<{
        idLavoro: string
        partenzaVetrina: Rettangolo | null
      }>,
    ) {
      stato.capoInIspezione = azione.payload.idLavoro
      stato.ritornoCapo = false
      stato.partenzaVetrina = azione.payload.partenzaVetrina
    },

    /* Ispezione 3D: il capo inizia a tornare / è tornato al suo posto */
    inizioRitornoCapo(stato) {
      stato.ritornoCapo = true
    },
    fineRitornoCapo(stato) {
      stato.capoInIspezione = null
      stato.ritornoCapo = false
    },

    /* Vetrina: il render è tornato al suo posto */
    chiusuraVetrina(stato) {
      stato.partenzaVetrina = null
      stato.capoInIspezione = null
    },
  },
})

export const {
  cambioVista,
  selezioneCapo,
  inizioRitornoCapo,
  fineRitornoCapo,
  chiusuraVetrina,
} = sliceScena.actions

export default sliceScena.reducer
