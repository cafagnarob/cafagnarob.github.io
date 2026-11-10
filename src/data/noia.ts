/**
 * data/noia.ts
 *
 * Tutti i contenuti dello spazio NOIA: manifesto, identità, collezioni.
 * La finestra NOIA (FinestraNoia) legge solo da qui; per aggiungere
 * un'immagine o una collezione si tocca questo file, non i componenti.
 *
 * Le immagini stanno in /public/images/noia/ (WebP, sfondo trasparente).
 * Larghezza e altezza servono al browser per riservare lo spazio
 * prima che l'immagine arrivi: niente salti di layout.
 */

/* ── Tipi ─────────────────────────────────────────────────────────── */

export type IdCollezione = "fw22" | "ss24"

/** "manifesto" è la scheda Noia: manifesto e identità insieme */
export type IdScheda = "manifesto" | IdCollezione | "campagne"

export interface ImmagineNoia {
  tipo?: "immagine"
  /** percorso pubblico del file */
  src: string
  /** etichetta in stile tavole: "jungle_mask.png" */
  nomeFile: string
  /** testo alternativo per screen reader */
  alt: string
  larghezza: number
  altezza: number
}

export interface VideoNoia {
  tipo: "video"
  /** percorso pubblico del file MP4 */
  src: string
  /** fotogramma mostrato prima che il video parta */
  poster: string
  nomeFile: string
  alt: string
  larghezza: number
  altezza: number
  /** true = film con sonoro: niente autoplay, controlli visibili */
  audio?: boolean
}

/** Un elemento di una galleria: foto o video */
export type MediaNoia = ImmagineNoia | VideoNoia

/**
 * Una raccolta da mostrare in galleria: una collezione (FW22-23, SS24)
 * o una campagna (deserto, metro…). Stessa forma, stesso componente.
 */
export interface RaccoltaNoia {
  id: string
  /** testo piccolo accanto al titolo: "fall / winter", "desert" */
  sigla: string
  titolo: string
  /** frase breve sotto il titolo */
  descrizione?: string
  media: MediaNoia[]
}

/* ── Utilità ──────────────────────────────────────────────────────── */

const CARTELLA = "/images/noia/"

/** Crea un'immagine NOIA a partire dal nome del file WebP */
function immagine(
  file: string,
  nomeFile: string,
  alt: string,
  larghezza: number,
  altezza: number,
): ImmagineNoia {
  return { src: `${CARTELLA}${file}.webp`, nomeFile, alt, larghezza, altezza }
}

/** Crea un video NOIA: MP4 e poster WebP hanno lo stesso nome */
function video(
  file: string,
  nomeFile: string,
  alt: string,
  larghezza: number,
  altezza: number,
  audio = false,
): VideoNoia {
  return {
    tipo: "video",
    src: `${CARTELLA}${file}.mp4`,
    poster: `${CARTELLA}${file}.webp`,
    nomeFile,
    alt,
    larghezza,
    altezza,
    audio,
  }
}

/* ── Schede della finestra, nell'ordine in cui compaiono ──────────── */

export const SCHEDE_NOIA: { id: IdScheda; etichetta: string }[] = [
  { id: "manifesto", etichetta: "Noia" },
  { id: "fw22", etichetta: "FW22-23" },
  { id: "ss24", etichetta: "SS24" },
  { id: "campagne", etichetta: "Campagne" },
]

/* ── Manifesto ────────────────────────────────────────────────────── */

/**
 * Il manifesto è diviso in blocchi: l'apertura (righe brevi, una per
 * riga, come nelle tavole) e le sezioni con titolo e paragrafi.
 * La finestra mostra le righe in grande e i paragrafi in testo normale.
 */
export interface BloccoManifesto {
  /** titolo della sezione; assente per l'apertura */
  titolo?: string
  /** righe brevi, mostrate una sotto l'altra in grande */
  righe?: string[]
  /** paragrafi di testo normale */
  paragrafi?: string[]
}

export const MANIFESTO_NOIA: BloccoManifesto[] = [
  {
    righe: [
      "Fermarsi.",
      "Fissare una mosca che ronza nella stanza.",
      "Non pensare a niente.",
    ],
  },
  {
    paragrafi: [
      "La noia non è tempo perso. È la creatività in fase di ricarica: il cervello si svuota dai pensieri e dagli stimoli che lo circondano, e resta in silenzio. Solo dopo essersi annoiati abbastanza si torna a fare, con più energia di prima.",
    ],
  },
  {
    titolo: "Un contenitore",
    paragrafi: [
      "NOIA è il nome che ho dato a quello che nasce dopo. Non un marchio da vendere, ma un nome d'arte che raccoglie un modo di guardare e di fare.",
      "È cominciato con la moda, perché in quel momento volevo sperimentare con i vestiti. Poi sono arrivati la stampa, il ricamo, i tappeti fatti a mano, i quadri, gli oggetti. Oggi ci sono anche i siti web.",
    ],
    righe: ["Cambiano i materiali, non l'approccio."],
  },
  {
    titolo: "I capi",
    paragrafi: [
      "Pensati per essere indossati e per stare sul mercato, ma nati per un altro motivo: esprimere un'idea e un gusto. Linee neutre, comodità, un'impronta tecnica: capi utili e fatti bene, per chi cerca qualità senza rumore. Li indosserei io, per primo.",
    ],
  },
  {
    titolo: "Il 3D",
    paragrafi: [
      "I capi sono stati progettati e realizzati in 3D, con CLO3D e Blender. Non per necessità: volevo studiare a fondo un mondo nuovo, e il 3D è diventato a sua volta uno strumento di espressione.",
    ],
  },
  {
    titolo: "La mosca",
    paragrafi: [
      "È la firma di NOIA. Non porta pensieri, non dà stimoli. Ronza, e ti ricorda di fermarti.",
    ],
  },
]

/* ── Identità ─────────────────────────────────────────────────────── */

/**
 * Apertura della scheda Noia: l'immagine protagonista (con il blocco
 * arancio), i testi tecnici e la frase in verticale.
 * Le frasi riprendono le parole del manifesto.
 */
export const COPERTINA_NOIA = {
  immagine: immagine(
    "fw22_jungle_mask_profilo",
    "jungle_mask_side.png",
    "La jungle mask di profilo",
    1271,
    1600,
  ),
  discipline: [
    "abbigliamento",
    // , "quadri", "tappeti", "oggetti", "siti web"
  ],
  verticale: "La creatività in fase di ricarica",
}

export const IDENTITA_NOIA = {
  /** logo condensato: è la stessa maschera usata per lo sfondo animato */
  logo: "/images/sfondo/noia_maschera.png",
  mosca: immagine(
    "mosca",
    "fly_print.png",
    "La mosca, firma di NOIA",
    216,
    241,
  ),
  /** colori del brand; gli stessi valori sono i token in FinestraNoia.module.css */
  palette: [
    { nome: "arancio", hex: "#c4441d" },
    { nome: "crema", hex: "#ece4d4" },
    { nome: "inchiostro", hex: "#1a1714" },
    { nome: "oliva", hex: "#6f6a45" },
  ],
  /** dettagli dei nastri e delle etichette sui capi */
  dettagli: [
    immagine(
      "fw22_jungle_mask_etichetta",
      "orange_tape.png",
      "Nastro arancio metallizzato con la scritta noia",
      1000,
      1600,
    ),
    immagine(
      "fw22_zaino_etichetta",
      "metal_tape.png",
      "Etichetta noia sul nastro arancio dello zaino",
      1005,
      1600,
    ),
  ],
}

/* ── Collezioni ───────────────────────────────────────────────────── */

export const COLLEZIONI_NOIA: Record<IdCollezione, RaccoltaNoia> = {
  fw22: {
    id: "fw22",
    sigla: "fall / winter",
    titolo: "FW22—23",
    media: [
      immagine(
        "fw22_felpa_rossa",
        "hoodie.png",
        "Felpa rossa con cappuccio e etichetta noia",
        1600,
        1349,
      ),
      immagine(
        "fw22_completo_denim",
        "denim_nylon_look.png",
        "Completo nero: giacca in denim a strati con impunture chiare e pantalone in nylon",
        592,
        1600,
      ),
      immagine(
        "fw22_outfit_pantalone_logo",
        "logo_pant_look.png",
        "Look con camicia oversize grigio antracite, t-shirt a maniche lunghe e il pantalone con il logo noia stampato",
        686,
        1600,
      ),
      immagine(
        "fw22_jungle_mask_fronte",
        "jungle_mask.png",
        "Jungle mask vista di fronte",
        1439,
        1600,
      ),
      immagine(
        "fw22_jungle_mask_profilo",
        "jungle_mask_side.png",
        "Jungle mask di profilo",
        1271,
        1600,
      ),
      immagine(
        "fw22_jungle_mask_lato",
        "jungle_mask_back.png",
        "Jungle mask dall'altro lato",
        1290,
        1600,
      ),
      immagine(
        "fw22_jungle_mask_dettaglio",
        "jungle_mask_detail.png",
        "Dettaglio del laccio della jungle mask",
        1045,
        1600,
      ),
      immagine(
        "fw22_zaino_fronte",
        "tactical_backpack.png",
        "Zaino tattico nero, fronte",
        1030,
        1600,
      ),
      immagine(
        "fw22_zaino_lato",
        "tactical_backpack_side.png",
        "Zaino tattico nero, di lato",
        1079,
        1600,
      ),
    ],
  },
  ss24: {
    id: "ss24",
    sigla: "spring / summer",
    titolo: "SS24",
    media: [
      immagine(
        "ss24_outfit_modello",
        "walk_outfit.png",
        "Outfit SS24 indossato: bomber, t-shirt e pantaloncino",
        754,
        1600,
      ),
      immagine(
        "ss24_bomber_pelle",
        "leather_bomber.png",
        "Bomber in pelle crema",
        1533,
        1430,
      ),
      immagine(
        "ss24_trench",
        "trench.png",
        "Trench lungo crema con profili arancio",
        409,
        566,
      ),
      immagine(
        "ss24_outfit_bomber",
        "bomber_tee.png",
        "Bomber, t-shirt e pantaloncino",
        855,
        1600,
      ),
      immagine(
        "ss24_tshirt_logo",
        "white_t-shirt_logo.png",
        "T-shirt bianca con logo noia",
        894,
        1007,
      ),
      immagine(
        "ss24_pantaloncino",
        "shorts.png",
        "Pantaloncino con pinces",
        1069,
        962,
      ),
      immagine(
        "ss24_borsa_imbottita",
        "puffer_bag.png",
        "Borsa imbottita in nylon crema",
        939,
        1587,
      ),
      video(
        "ss24_outfit_bomber_giro",
        "bomber_tee_360.mp4",
        "Il look con bomber, t-shirt e pantaloncino che ruota su se stesso",
        720,
        1280,
      ),
    ],
  },
}

/* ── Campagne ──────────────────────────────────────────────────────── */

/**
 * Le campagne, nell'ordine in cui compaiono nella scheda.
 * I nomi "film" e "strada" sono provvisori: da confermare con Roberto.
 */
export const CAMPAGNE_NOIA: RaccoltaNoia[] = [
  {
    id: "deserto",
    sigla: "desert",
    titolo: "Deserto",
    media: [
      immagine(
        "deserto_01",
        "desert_01.png",
        "Giacca a strati con profili arancio e pantaloncino nel deserto",
        1200,
        1200,
      ),
      immagine(
        "deserto_02",
        "desert_02.png",
        "Felpa con zip e logo arancio, mano sulla testa",
        1200,
        1200,
      ),
      video(
        "campagna_deserto",
        "desert_walk.mp4",
        "Il modello in felpa nera cammina nel deserto al tramonto",
        720,
        1280,
      ),
      immagine(
        "deserto_03",
        "desert_03.png",
        "Cappotto lungo con profili arancio mosso dal vento",
        1200,
        1200,
      ),
      immagine(
        "deserto_04",
        "desert_04.png",
        "Bomber in pelle crema, t-shirt e pantaloncino",
        1200,
        1200,
      ),
      immagine(
        "deserto_05",
        "desert_05.png",
        "Canotta, cappellino e pantalone ampio",
        1200,
        1200,
      ),
      immagine(
        "deserto_06",
        "desert_06.png",
        "Camicia a quadri verdi e borsa imbottita",
        1200,
        1200,
      ),
    ],
  },
  {
    id: "red-room",
    sigla: "red room",
    titolo: "Red room",
    media: [
      immagine(
        "redroom_01",
        "red_room_01.png",
        "La stanza rossa vuota: una sedia davanti alla vetrata illuminata",
        1200,
        1200,
      ),
      immagine(
        "redroom_02",
        "red_room_02.png",
        "Il modello in felpa con cappuccio in piedi accanto alla sedia",
        1200,
        1200,
      ),
      immagine(
        "redroom_03",
        "red_room_03.png",
        "Seduto sulla sedia con le mani dietro la testa",
        1200,
        1200,
      ),
      immagine(
        "redroom_04",
        "red_room_04.png",
        "Accovacciato al centro della stanza",
        1200,
        1200,
      ),
      immagine(
        "redroom_05",
        "red_room_05.png",
        "Accovacciato con una mano sul viso",
        1200,
        1200,
      ),
      immagine(
        "redroom_06",
        "red_room_06.png",
        "Accovacciato a destra della sedia",
        1080,
        1080,
      ),
      immagine(
        "redroom_07",
        "red_room_07.png",
        "In ginocchio sul pavimento accanto alla sedia",
        1080,
        1080,
      ),
      immagine(
        "redroom_08",
        "red_room_08.png",
        "Un pugno verso la vetrata",
        1080,
        1080,
      ),
      immagine(
        "redroom_09",
        "red_room_09.png",
        "Un calcio a una bottiglia che vola",
        1200,
        1200,
      ),
      immagine(
        "redroom_10",
        "red_room_10.png",
        "Sdraiato a terra accanto alla sedia",
        1080,
        1080,
      ),
      immagine(
        "redroom_11",
        "red_room_11.png",
        "La stanza vuota con il logo noia sovrapposto",
        900,
        1600,
      ),
    ],
  },
  {
    id: "metro",
    sigla: "metro",
    titolo: "Metro",
    media: [
      immagine(
        "metro_01",
        "metro_01.png",
        "Il modello scende le scale della metro",
        1080,
        1080,
      ),
      immagine(
        "metro_02",
        "metro_02.png",
        "Calcio verso l'obiettivo nel sottopassaggio",
        1080,
        1080,
      ),
      immagine(
        "metro_03",
        "metro_03.png",
        "Seduto a terra con t-shirt e pantaloncino bianchi",
        1080,
        1080,
      ),
      immagine(
        "metro_04",
        "metro_04.png",
        "Seduto sul pavimento, le sneaker in primo piano",
        1080,
        1080,
      ),
      immagine(
        "metro_05",
        "metro_05.png",
        "Seduto sui gradini con le mani tatuate",
        1080,
        1080,
      ),
      immagine(
        "metro_06",
        "metro_06.png",
        "Sdraiato sulla panca nella luce viola",
        1080,
        1080,
      ),
      immagine(
        "metro_07",
        "metro_07.png",
        "Primo piano con la t-shirt logo noia",
        1080,
        1080,
      ),
      immagine(
        "metro_08",
        "metro_08.png",
        "Appoggiato al muro di piastrelle verdi",
        1080,
        1080,
      ),
    ],
  },
  {
    id: "film",
    sigla: "film",
    titolo: "Film",
    media: [
      video(
        "campagna_film",
        "noia_film.mp4",
        "Il film della campagna: camicia a quadri in una stanza gialla, finale con il logo noia",
        720,
        1280,
      ),
      video(
        "campagna_specchio",
        "mirror.mp4",
        "Le gambe tatuate riflesse in uno specchio",
        720,
        1280,
      ),
      immagine(
        "campagna_ritratto",
        "portrait.png",
        "Ritratto con la camicia a quadri verdi",
        900,
        1600,
      ),
    ],
  },
  {
    id: "strada",
    sigla: "street",
    titolo: "Strada",
    media: [
      video(
        "campagna_strada",
        "street.mp4",
        "Il modello in felpa bianca cammina in una strada di notte",
        324,
        576,
      ),
    ],
  },
]

/* ── Collegamento con l'armadio della stanza ──────────────────────── */

/**
 * A quale scheda apre il link "Scopri NOIA →" del cartellino.
 * I capi presenti nelle tavole aprono la loro collezione;
 * quelli che non ci sono (capo_6, le scarpe) aprono il manifesto,
 * cioè la storia di NOIA.
 */
export const SCHEDA_DEL_CAPO: Record<string, IdScheda> = {
  capo_1: "ss24", // puffer bag in nylon
  capo_2: "ss24", // bomber in pelle
  capo_3: "ss24", // t-shirt logo + pantaloncino del look bomber
  capo_4: "fw22", // jungle mask
  capo_5: "fw22", // pantalone in gabardine del look puffer leather
  capo_6: "manifesto", // scarpe NOIA, non presenti nelle tavole: apre la scheda Noia
  capo_7: "fw22", // tactical backpack
}
