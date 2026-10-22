/*
 * Lavori di moda
 * Contenuti delle schede che si aprono cliccando i capi nell'armadio.
 * La chiave è l'id del lavoro (vedi CAPI_CLICCABILI in config/armadio.ts).
 *
 * immagini: percorsi in public/, es. '/images/moda/capo_1/01.jpg'.
 * Per ora sono contenuti SEGNAPOSTO, da sostituire con quelli reali.
 */

/*
 * turntable (opzionale): render a 360° esportato da CLO.
 *   cartella: percorso in public/ dei fotogrammi 00.webp, 01.webp…
 *   fotogrammi: quanti sono (il primo, 00, deve essere frontale).
 * I lavori senza turntable usano l'ispezione 3D.
 */
export type Turntable = {
  cartella: string
  fotogrammi: number
  fotogrammaArmadio: number
}

export type LavoroModa = {
  titolo: string
  categoria: string
  anno: string
  descrizione: string
  immagini: string[]
  turntable?: Turntable
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
    titolo: "Bomber in pelle",
    categoria: "Capispalla",
    anno: "2024",
    descrizione: SEGNAPOSTO,
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_2/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 24,
    },
  },
  capo_3: {
    titolo: "Camicia in jersey",
    categoria: "Collezione",
    anno: "2023",
    descrizione: SEGNAPOSTO,
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_3/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 24,
    },
  },
  capo_4: {
    titolo: "Capo 4",
    categoria: "Collezione",
    anno: "2022",
    descrizione: SEGNAPOSTO,
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_4/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 1,
    },
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
    turntable: {
      cartella: "/images/moda/capo_7/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 5,
    },
  },
}
