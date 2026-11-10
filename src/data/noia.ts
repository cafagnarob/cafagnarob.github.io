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

export type IdScheda = "manifesto" | "identita" | IdCollezione | "campagne"

export interface ImmagineNoia {
  /** percorso pubblico del file */
  src: string
  /** etichetta in stile tavole: "jungle_mask.png" */
  nomeFile: string
  /** testo alternativo per screen reader */
  alt: string
  larghezza: number
  altezza: number
}

export interface CollezioneNoia {
  id: IdCollezione
  /** sigla mostrata sul badge: "FW22-23" */
  sigla: string
  titolo: string
  /** frase breve sotto il titolo (da completare con Roberto) */
  descrizione?: string
  immagini: ImmagineNoia[]
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

/* ── Schede della finestra, nell'ordine in cui compaiono ──────────── */

export const SCHEDE_NOIA: { id: IdScheda; etichetta: string }[] = [
  { id: "manifesto", etichetta: "Manifesto" },
  { id: "identita", etichetta: "Identità" },
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

export const COLLEZIONI_NOIA: Record<IdCollezione, CollezioneNoia> = {
  fw22: {
    id: "fw22",
    sigla: "FW22-23",
    titolo: "Fall Winter 22-23",
    immagini: [
      immagine(
        "fw22_felpa_rossa",
        "hoodie.png",
        "Felpa rossa con cappuccio e etichetta noia",
        1600,
        1349,
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
    sigla: "SS24",
    titolo: "Spring Summer 24",
    immagini: [
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
    ],
  },
}

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
  capo_6: "manifesto", // scarpe NOIA, non presenti nelle tavole
  capo_7: "fw22", // tactical backpack
}
