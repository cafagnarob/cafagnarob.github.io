/*
 * Contesto audio condiviso
 * Un solo AudioContext per tutto il sito, con un guadagno principale
 * ("uscita") a cui si collegano tutti i suoni: servirà per il muto
 * globale e per l'audio d'ambiente.
 *
 * - Creato alla prima richiesta, non all'avvio.
 * - I browser lo tengono "sospeso" finché l'utente non interagisce:
 *   sbloccaAudio va chiamata dentro un clic.
 * contestoCreato: per chi legge l’audio senza produrlo (spettro)
 */
let contesto: AudioContext | null = null
let uscita: GainNode | null = null
let livelloPrincipale = 1 // 0 = muto; applicato anche al contesto creato dopo

export function contestoAudio() {
  if (!contesto || !uscita) {
    contesto = new AudioContext()
    uscita = contesto.createGain()
    uscita.gain.value = livelloPrincipale
    uscita.connect(contesto.destination)
  }
  return { contesto, uscita }
}

export function sbloccaAudio() {
  const { contesto } = contestoAudio()
  if (contesto.state === "suspended") void contesto.resume()
}

/* Volume di tutto il sito. Se il contesto non esiste ancora (nessun
   suono partito), il valore viene usato alla sua creazione.
   setTargetAtTime: passaggio morbido di pochi centesimi di secondo,
   senza "click" quando si muove il cursore. */
export function impostaLivelloPrincipale(livello: number) {
  livelloPrincipale = livello
  if (contesto && uscita) {
    uscita.gain.setTargetAtTime(livello, contesto.currentTime, 0.03)
  }
}

/* Il contesto esiste già? (Chi vuole solo LEGGERE l'audio, come lo
   spettro, non deve crearlo: senza un clic nascerebbe sospeso) */
export const contestoCreato = () => contesto !== null

/* Livello principale attuale (0 = muto o volume a zero): lo spettro lo
   usa per far scendere i LED più lentamente quando l'audio è spento */
export const livelloPrincipaleAttuale = () => livelloPrincipale
