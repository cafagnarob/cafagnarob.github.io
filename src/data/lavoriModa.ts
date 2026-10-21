/*
 * Lavori di moda
 * Contenuti delle schede che si aprono cliccando i capi nell'armadio.
 * La chiave è l'id del lavoro (vedi CAPI_CLICCABILI in config/armadio.ts).
 *
 * immagini: percorsi in public/, es. '/images/moda/capo_1/01.jpg'.
 * Per ora sono contenuti SEGNAPOSTO, da sostituire con quelli reali.
 */
export type LavoroModa = {
  titolo: string
  categoria: string
  anno: string
  descrizione: string
  immagini: string[]
}

const SEGNAPOSTO =
  "Descrizione del progetto: concept, materiali, processo creativo e risultato finale."

export const LAVORI_MODA: Record<string, LavoroModa> = {
  capo_1: {
    titolo: "Borsa imbottita",
    categoria: "Accessori",
    anno: "2024",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_2: {
    titolo: "Giacca in pelle",
    categoria: "Capispalla",
    anno: "2023",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_3: {
    titolo: "Camicia in jersey",
    categoria: "Collezione",
    anno: "2023",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_4: {
    titolo: "Capo 4",
    categoria: "Collezione",
    anno: "2022",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_5: {
    titolo: "Pantalone in gabardine",
    categoria: "Collezione",
    anno: "2022",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_6: {
    titolo: "Capo 6",
    categoria: "Accessori",
    anno: "2021",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
  capo_7: {
    titolo: "Zaino tecnico",
    categoria: "Accessori",
    anno: "2024",
    descrizione: SEGNAPOSTO,
    immagini: [],
  },
}
