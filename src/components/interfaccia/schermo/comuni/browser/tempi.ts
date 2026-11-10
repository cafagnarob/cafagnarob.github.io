/*
 * Tempi del browser (millisecondi)
 * La linea del tempo della "visita" a un sito:
 *   apertura → attesa → digitazione (una lettera ogni "passo")
 *   → pausa → invio → caricamento → pagina
 * tempiDigitazione calcola gli istanti chiave per un indirizzo di
 * N lettere; Browser li passa al CSS come variabili.
 */
export const TEMPI = {
  apertura: 250, // la finestra si apre
  attesa: 450, // prima di iniziare a scrivere
  passo: 65, // una lettera
  pausa: 350, // fine digitazione → invio
  caricamento: 800, // barra di caricamento
}

export function tempiDigitazione(lettere: number) {
  const inizio = TEMPI.apertura + TEMPI.attesa
  const invio = inizio + lettere * TEMPI.passo + TEMPI.pausa
  const pagina = invio + TEMPI.caricamento
  return { inizio, invio, pagina }
}
