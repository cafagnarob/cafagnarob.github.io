/*
 * Progetti IT del portfolio
 * Elenco unico letto da tutte e due le interfacce degli schermi:
 * - desktop (vista PC): icone sul desktop → finestra del progetto
 * - telefono (vista telefono): app nella home → app a tutto schermo
 * Per aggiungere un progetto basta un nuovo oggetto in PROGETTI e la
 * sua cartella in public/images/progetti/<id>/ (icona e anteprime).
 * L'ordine dell'elenco è l'ordine delle icone.
 *
 * Campi:
 * - id: identificatore unico, anche nome della cartella delle immagini
 * - nome: sotto l'icona e nel titolo della finestra
 * - sottotitolo: una riga, cosa è il progetto
 * - descrizione: paragrafi della finestra/app
 * - tecnologie: etichette (stack)
 * - stato: "in corso" | "completato" (etichetta nella finestra)
 * - link: demo e codice, facoltativi (niente link = niente pulsante)
 * - colore: colore dell'app (barra della finestra, schermata di avvio
 *   sul telefono): conviene prenderlo dall'icona
 */
export type StatoProgetto = "in corso" | "completato"

export type Progetto = {
  id: string
  nome: string
  sottotitolo: string
  descrizione: string[]
  tecnologie: string[]
  stato: StatoProgetto
  link?: { demo?: string; codice?: string }
  colore: string
  indirizzo: string // indirizzo mostrato e digitato nel browser (senza https://)
}

/* Percorsi delle immagini, ricavati dall'id: nessun percorso scritto a mano */
const CARTELLA = "/images/progetti"
export const iconaDi = (p: Progetto) => `${CARTELLA}/${p.id}/icona.webp`
export const anteprimeDi = (p: Progetto, quante: number) =>
  Array.from(
    { length: quante },
    (_, i) => `${CARTELLA}/${p.id}/anteprima-${i + 1}.webp`,
  )

export const PROGETTI: Progetto[] = [
  {
    id: "muma-gin",
    nome: "MUMA GIN",
    sottotitolo: "E-commerce per un gin artigianale pugliese",
    descrizione: [
      // DA CONFERMARE: testo di bozza, riscrivilo con parole tue
      "Negozio online per MUMA GIN, marchio di gin della Puglia: il mio primo progetto per un cliente reale, destinato alla messa in produzione.",
      "Catalogo navigabile senza registrazione, carrello lato client, verifica della maggiore età e accesso con email per ordini e profilo. Backend a monolite modulare organizzato per dominio.",
      "In arrivo: una bottiglia 3D modellata in Blender e mostrata con React Three Fiber.",
    ],
    tecnologie: [
      "React",
      "Spring Boot",
      "Java 21",
      "PostgreSQL",
      "JWT",
      "Three.js",
    ],
    stato: "in corso",
    link: {
      // DA CONFERMARE: aggiungi i link quando ci sono (o lasciali vuoti)
      // demo: "https://…",
      // codice: "https://github.com/…",
    },
    colore: "#1f3a34", // DA CONFERMARE: prendilo dall'icona
    indirizzo: "mumagin.it", // DA CONFERMARE
  },
]
