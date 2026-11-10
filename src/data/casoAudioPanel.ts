/*
 * Caso studio Audio Panel
 * Tutti i testi e le immagini della finestra Audio Panel, presi dal
 * README del progetto. La finestra legge solo da qui: per cambiare una
 * frase si tocca questo file, non i componenti.
 * Immagini in public/progetti/audio-panel/ (le stesse del README).
 */

const CARTELLA = "/progetti/audio-panel/"

export type Immagine = { src: string; alt: string }

/* Le sezioni, nell'ordine della pagina. tono: fondo chiaro o scuro.
   etichetta: voce del menu in alto (l'apertura non ne ha) */
export const SEZIONI_AUDIO_PANEL = [
  { id: "ap-apertura", tono: "chiara" },
  { id: "ap-sintesi", tono: "scura", etichetta: "Sintesi" },
  { id: "ap-problema", tono: "chiara", etichetta: "Problema" },
  { id: "ap-processo", tono: "scura", etichetta: "Processo" },
  { id: "ap-sistema", tono: "chiara", etichetta: "Design system" },
  { id: "ap-responsive", tono: "scura", etichetta: "Responsive" },
  { id: "ap-codice", tono: "chiara", etichetta: "Codice" },
  { id: "ap-imparato", tono: "scura", etichetta: "Imparato" },
] as const

export type IdSezione = (typeof SEZIONI_AUDIO_PANEL)[number]["id"]

export const CASO_AUDIO_PANEL = {
  titolo: "Audio Panel",
  sottotitolo:
    "Un controllo audio in stile hardware vintage per un sito 3D: progettato in Figma, sviluppato con React e la Web Audio API.",
  tag: ["UI/UX", "design system", "Figma", "React", "Web Audio API"],
  copertina: {
    src: `${CARTELLA}copertina.webp`,
    alt: "Audio Panel aperto sopra la scena 3D",
  },

  sintesi: [
    { voce: "Progetto", valore: "Pannello audio sovrapposto alla scena three.js di questo portfolio" },
    { voce: "Ruolo", valore: "Tutto: UI/UX design, design system, prototipo, handoff, sviluppo front-end" },
    { voce: "Strumenti", valore: "Figma, React 19 + TypeScript, Redux Toolkit, CSS Modules, Web Audio API" },
    { voce: "Tempi", valore: "2–4 novembre 2026" },
    { voce: "Versioni", valore: "Desktop (25 bande di frequenza) e mobile (canali L/R)" },
  ],
  citazione: {
    premessa: "Vengo dalla moda: bozza, prototipo, revisione, capo finito.",
    frase: "Ho cambiato gli strumenti di lavoro, non il metodo.",
  },

  problema: {
    testo:
      "Un sito in 3D ha bisogno di un controllo audio che non rompa l'atmosfera. Un player classico, con una barra e un'icona dell'altoparlante, sembra un elemento estraneo sopra un mondo tridimensionale.",
    obiettivi: [
      "Sembrare un oggetto fisico, credibile come un mixer vero",
      "Mostrare la musica viva, con LED che si accendono a ritmo",
      "Fare solo tre cose: volume, mute, aprirsi e chiudersi",
      "Non coprire la scena, soprattutto su telefono",
      "Restare accessibile da tastiera e screen reader",
    ],
  },

  processo: {
    testo: "Sei iterazioni in Figma, ognuna nata da una revisione critica della precedente.",
    immagine: {
      src: `${CARTELLA}evoluzione.webp`,
      alt: "Le iterazioni del pannello, dalla bozza piatta al metallo",
    },
    passi: [
      { titolo: "Bozza piatta", testo: "Idea chiara, ma tutto piatto e un tasto mute ambiguo" },
      { titolo: "Primo metallo", testo: "Gradiente conico sulla manopola, LED bombati" },
      { titolo: "Una sola luce", testo: "Luce unica in alto a sinistra, texture spazzolata, ombre di contatto" },
      { titolo: "Stati dei LED", testo: "Accesi saturi con nucleo e glow, spenti al 15–20%" },
      { titolo: "Manopola leggibile", testo: "Arco di 270°, un solo indicatore, tacche sul pannello" },
      { titolo: "Mute come manopola", testo: "Selettore rotativo LIVE/MUTE con spia rossa" },
    ],
    dettaglio:
      "In una manopola vera il riflesso non gira, perché la luce è ferma. Ruota solo il puntino.",
  },

  sistema: {
    testo:
      "Costruito dal più piccolo al più grande, come in React: prima gli atomi, poi i pezzi composti, infine il pannello.",
    immagine: {
      src: `${CARTELLA}design-system.webp`,
      alt: "Component set: LED, colonne, manopola, mute, pannello",
    },
    componenti: [
      { nome: "led", proprieta: "color, state", valori: "green / yellow / red · on / off" },
      { nome: "meter-column", proprieta: "level", valori: "0–11 (6 verdi, 3 gialli, 2 rossi)" },
      { nome: "meter", proprieta: "colonne", valori: "25 desktop · 2 mobile" },
      { nome: "knob", proprieta: "value", valori: "0–10" },
      { nome: "mute-switch", proprieta: "muted", valori: "true / false" },
      { nome: "audio-panel", proprieta: "expanded, muted", valori: "true / false" },
    ],
    nota:
      "La spia del mute è lo stesso led rosso dello spettro; il selettore è lo stesso knob del volume, con due sole posizioni.",
  },

  responsive: {
    interazioni: [
      { titolo: "Apertura", testo: "Clic sul pannello chiuso. La piastra cresce dall'angolo, lo spettro scivola al suo posto, i comandi compaiono dopo." },
      { titolo: "Chiusura", testo: "Clic in qualsiasi punto fuori dal pannello, o Esc." },
      { titolo: "Mute", testo: "Il selettore gira su MUTE, la spia si accende e i LED si spengono piano, come un meter vero." },
      { titolo: "Musica", testo: "Il sito parte in silenzio. Alzare il volume avvia il giradischi; cliccare il giradischi fa salire il volume da solo al 25%." },
    ],
    testo:
      "Su mobile le 25 bande diventano 2 colonne, che cambiano significato: i canali sinistro e destro.",
    immagine: { src: `${CARTELLA}mobile.webp`, alt: "Versione desktop e versione mobile" },
    confronto: [
      { voce: "Chiuso", desktop: "363 × 173 px", mobile: "59 × 225 px" },
      { voce: "Aperto", desktop: "363 × 283 px", mobile: "157 × 225 px" },
      { voce: "Spettro", desktop: "25 bande di frequenza", mobile: "2 canali L/R" },
      { voce: "LED", desktop: "8 × 8 px", mobile: "12 × 12 px" },
      { voce: "Comandi", desktop: "in basso, affiancati", mobile: "a destra, impilati" },
    ],
  },

  codice: {
    architettura: `musica (AudioBuffer) → uscita (GainNode: volume² / mute) → destination
                              ├→ AnalyserNode (fft 4096) → 25 bande · desktop
                              └→ stereo (GainNode, 2 canali) → ChannelSplitter
                                      ├→ AnalyserNode L → picco in dB · mobile
                                      └→ AnalyserNode R`,
    punti: [
      { titolo: "Meter post-fader", testo: "L'analisi sta dopo il volume, quindi i LED seguono volume e mute senza codice in più." },
      { titolo: "Bande", testo: "25 bande logaritmiche da 50 Hz a 16 kHz, come l'orecchio sente le frequenze. Su mobile, il picco di ogni canale in decibel." },
      { titolo: "Ritmo realistico", testo: "Salita in 60 ms, discesa in 140 ms; con il mute la discesa rallenta a 900 ms." },
    ],
    led: {
      testo:
        "Un solo ciclo requestAnimationFrame scrive una variabile CSS per colonna, e solo quando cambia. È il CSS ad accendere ogni LED:",
      css: `.led {
  --acceso: clamp(0, var(--livello) - var(--i) + 1, 1); /* 0 o 1 */
}
.led::after {
  background: var(--immagine-accesa); /* LED acceso esportato da Figma */
  opacity: var(--acceso);
}`,
    },
    scelte: [
      { scelta: "Immagini di Figma per LED, tacche e scritte", perche: "Aspetto identico al design; lo stato resta al CSS" },
      { scelta: 'popover="auto" per aprire e chiudere', perche: "Clic esterno ed Esc li gestisce il browser, senza useEffect" },
      { scelta: "@starting-style e clip-path", perche: "La stessa piastra si allarga, senza stirare la texture" },
      { scelta: "Pointer Events + setPointerCapture", perche: "Mouse, dito e penna con lo stesso codice" },
      { scelta: "useSyncExternalStore su matchMedia", perche: "Desktop o mobile senza useEffect" },
    ],
    accessibilita: [
      { elemento: "Volume", come: 'role="slider", aria-valuenow, aria-valuetext; frecce, Home/End, rotellina' },
      { elemento: "Mute", come: '<button role="switch" aria-checked>, Spazio e Invio' },
      { elemento: "Pannello chiuso", come: "<button aria-expanded> «Apri controlli audio»" },
      { elemento: "Movimento", come: "con prefers-reduced-motion niente animazioni, LED a scatti" },
    ],
  },

  imparato: [
    "Il realismo nasce dalla stratificazione: gradiente, texture, bordi, ombre. Se manca un livello, l'oggetto sembra disegnato.",
    "Lo skeuomorfismo è una pelle: sotto deve esserci un'interfaccia accessibile.",
    "Prima di scrivere logica, conviene cercare cosa offre già la piattaforma: popover, pointer capture, media query.",
    "Le misure di un handoff vanno verificate a 1x: un LED da 20 px nell'export era da 8 px nel pannello.",
  ],
  chiusura: "Il pannello è in questa stanza, in basso a destra.",
}
