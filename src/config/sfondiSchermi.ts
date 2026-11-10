/*
 * Sfondi degli schermi nella stanza
 * Per ogni schermo con un'immagine al posto del colore provvisorio:
 * - schermo: nome della mesh come in Blender
 * - vuotoVista: empty da cui la camera guarda quello schermo; serve a
 *   capire qual è la faccia davanti (analizzaPiano), così l'immagine
 *   non risulta specchiata
 * - percorso: immagine in public/ (stesso percorso = scaricata una volta)
 * - aspetto: larghezza / altezza dell'immagine, per il ritaglio "cover"
 *   (uvSulPiano): copre lo schermo senza deformarsi
 * Uno schermo nuovo va anche in OGGETTI_SPECIALI.schermi (config/stanza):
 * lì si dice che è uno schermo, qui quale immagine mostra.
 * Non confondere con SCHERMI (config/schermi): quelli sono gli schermi
 * che si accendono a tutto schermo con l'interfaccia HTML.
 * LUMINOSITA_SCHERMI moltiplica i colori: abbassala se gli schermi
 * "bucano" la penombra, alzala se dopo AgX sembrano spenti.
 */
export const SFONDI_SCHERMI = {
  pc: {
    schermo: "screen.001",
    vuotoVista: "vista_pc",
    percorso: "/images/schermi/sfondo_pc_1024.webp",
    aspetto: 1919 / 1200,
  },
  pcSinistro: {
    schermo: "screen",
    vuotoVista: "vista_pc",
    percorso: "/images/schermi/sfondo_pc_1024.webp",
    aspetto: 1919 / 1200,
  },
  telefono: {
    schermo: "schermo_telefono",
    vuotoVista: "vista_telefono",
    percorso: "/images/schermi/sfondo_telefono.webp",
    aspetto: 525 / 1138,
  },
} as const

export type ChiaveSchermo = keyof typeof SFONDI_SCHERMI

/* Solo i percorsi, nella forma che vuole useTexture (chiave → URL):
   restituisce un oggetto di texture con le stesse chiavi */
export const PERCORSI_SFONDI = Object.fromEntries(
  Object.entries(SFONDI_SCHERMI).map(([chiave, s]) => [chiave, s.percorso]),
) as Record<ChiaveSchermo, string>

export const LUMINOSITA_SCHERMI = 1
