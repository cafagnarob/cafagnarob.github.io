/*
 * Lavori di moda
 * Contenuti delle schede che si aprono cliccando i capi nell'armadio.
 * La chiave è l'id del lavoro (vedi CAPI_CLICCABILI in config/armadio.ts).
 * Tutti i capi sono del brand NOIA: le collezioni e le immagini complete
 * stanno in data/noia.ts (il cartellino ci porta con "Scopri NOIA →").
 *
 * immagini: percorsi in public/, es. '/images/moda/capo_1/01.jpg'.
 */

/*
 * turntable (opzionale): render a 360° esportato da CLO.
 *   cartella: percorso in public/ dei fotogrammi 00.webp, 01.webp…
 *   fotogrammi: quanti sono (il primo, 00, deve essere frontale).
 * I lavori senza turntable usano l'ispezione 3D.
 */

/*
 * Cartellino (campi facoltativi):
 *   codice: codice del cartellino (se manca: NOIA-<numero del capo>)
 *   collezione, stagione: sotto il nome
 *   materiali, processo, software: la scheda del capo
 * Il sottotitolo unisce collezione (o categoria), stagione e anno,
 * saltando i campi vuoti.
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
  // Cartellino
  codice?: string
  collezione?: string
  stagione?: string
  materiali?: string[]
  processo?: string[]
  software?: string[]
}

/* Codice del cartellino: quello scritto, oppure ricavato dall'id
   ("capo_2" → "NOIA-02") */
export const codiceDi = (id: string, lavoro: LavoroModa) =>
  lavoro.codice ?? `NOIA-${id.replace(/\D/g, "").padStart(2, "0")}`

/* ── Valori comuni ────────────────────────────────────────────────── */

const FW22 = {
  collezione: "FW22—23",
  stagione: "Autunno / Inverno",
  anno: "2022",
}
const SS24 = {
  collezione: "SS24",
  stagione: "Primavera / Estate",
  anno: "2024",
}

/* Il percorso di lavoro di ogni capo NOIA */
const PROCESSO = [
  "Cartamodello in CLO3D",
  "Simulazione e fit sull'avatar",
  "Render in Blender",
]

/* Per i capi con turntable il render a 360° esce da CLO3D */
const PROCESSO_TURNTABLE = [
  "Cartamodello in CLO3D",
  "Simulazione e fit sull'avatar",
  "Render 360° in CLO3D",
]

const SOFTWARE = ["CLO3D", "Blender", "Photoshop"]

/* ── I capi ───────────────────────────────────────────────────────── */

export const LAVORI_MODA: Record<string, LavoroModa> = {
  capo_1: {
    titolo: "Borsa imbottita",
    categoria: "Accessori",
    ...SS24,
    descrizione:
      "Una borsa morbida come un cuscino: quattro volumi imbottiti in nylon e una tracolla lunga annodata. Leggera, capiente, da portare a spalla senza pensarci.",
    immagini: [],
    materiali: ["Nylon imbottito", "Tracolla in nylon", "Etichetta noia"],
    processo: PROCESSO,
    software: SOFTWARE,
  },

  capo_2: {
    titolo: "Bomber in pelle",
    categoria: "Capispalla",
    ...SS24,
    descrizione:
      "Il bomber in una versione ampia e morbida, in pelle crema con una superficie craquelé che sembra vissuta. Collo e polsini in maglia, maniche over che cadono sulle mani.",
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_2/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 24,
    },
    materiali: [
      "Pelle con finitura craquelé",
      "Collo e polsini in maglia a costine",
      "Zip in metallo",
    ],
    processo: PROCESSO_TURNTABLE,
    software: ["CLO3D", "Photoshop", "Illustrator"],
  },

  capo_3: {
    titolo: "T-shirt logo e pantaloncino",
    categoria: "Look",
    ...SS24,
    descrizione:
      "La base del look SS24: una t-shirt in jersey con il logo noia piccolo al centro e un pantaloncino ampio con le pinces. Due capi semplici, pensati per stare sotto al bomber.",
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_3/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 24,
    },
    materiali: ["Jersey", "Logo noia stampato", "Pantaloncino con pinces"],
    processo: PROCESSO_TURNTABLE,
    software: SOFTWARE,
  },

  capo_4: {
    titolo: "Jungle mask",
    categoria: "Accessori",
    ...FW22,
    descrizione:
      "Un cappello da esploratore che diventa maschera: la tesa larga, il paraviso che copre il volto e la mantellina sul collo. Si chiude con i lacci avorio e porta il nastro noia arancio metallizzato.",
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_4/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 1,
    },
    materiali: [
      "Tessuto ripstop",
      "Lacci in fettuccia avorio",
      "Nastro noia arancio metallizzato",
    ],
    processo: PROCESSO_TURNTABLE,
    software: SOFTWARE,
  },

  capo_5: {
    titolo: "Pantalone logo",
    categoria: "Pantaloni",
    ...FW22,
    descrizione:
      "Un pantalone ampio in gabardine con la vita elastica e il logo noia stampato in grande sulle gambe, tono su tono. Da lontano è un pantalone nero; da vicino le lettere diventano la sua forma.",
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_5/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 24,
    },
    materiali: [
      "Gabardine",
      "Vita elastica con coulisse",
      "Stampa logo noia tono su tono",
    ],
    processo: PROCESSO_TURNTABLE,
    software: SOFTWARE,
  },

  capo_6: {
    titolo: "Scarpe",
    categoria: "Calzature",
    anno: "",
    descrizione:
      "Le scarpe di NOIA: non fanno parte delle collezioni nelle tavole, ma completano i look della stanza. Dal cartellino si apre la storia del brand.",
    immagini: [],
    processo: PROCESSO,
    software: SOFTWARE,
  },

  capo_7: {
    titolo: "Zaino tattico",
    categoria: "Accessori",
    ...FW22,
    descrizione:
      "Uno zaino nero carico di fettucce, fibbie e tasche, come l'attrezzatura militare. L'unico colore è il nastro arancio con la targhetta noia, appeso sul fronte.",
    immagini: [],
    turntable: {
      cartella: "/images/moda/capo_7/turntable",
      fotogrammi: 32,
      fotogrammaArmadio: 5,
    },
    materiali: [
      "Nylon tecnico",
      "Fettucce e fibbie",
      "Nastro arancio con targhetta noia",
    ],
    processo: PROCESSO_TURNTABLE,
    software: SOFTWARE,
  },
}
