/*
 * Invito al clic
 * Nella panoramica gli alone degli oggetti cliccabili "respirano" anche
 * senza hover, per far capire che si possono toccare (soprattutto su
 * mobile, dove l'hover non esiste). Il respiro si spegne entrando in una
 * vista e riparte da capo ogni volta che la camera torna alla panoramica.
 *
 * Un respiro = sale e scende in DURATA_S, poi pausa fino a PERIODO_S.
 * Gli oggetti si accendono nell'ordine di ORDINE, SFASAMENTO_S uno
 * dopo l'altro. Gli oggetti non elencati vanno in coda.
 */
export const INVITO = {
  PERIODO_S: 5, // ogni quanto riparte il giro completo
  DURATA_S: 1.6, // quanto dura un respiro (salita + discesa)
  SFASAMENTO_S: 0.7, // ritardo tra un oggetto e il successivo
  RITARDO_S: 0.4, // attesa dopo l'arrivo della camera, prima del primo respiro
  INTENSITA: 0.55, // forza massima del respiro (1 = come l'hover)
  /** nomi delle viste, nell'ordine in cui si accendono */
  ORDINE: [
    "armadio",
    "pc",
    "telefono",
    "letto",
    "giradischi",
  ] as readonly string[],
}
