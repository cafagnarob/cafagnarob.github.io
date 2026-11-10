/*
 * useOra
 * Ora corrente, aggiornata all'inizio di ogni minuto, SENZA useEffect:
 * useSyncExternalStore "si abbona" a una sorgente esterna a React (qui
 * un timer) e rilegge il valore quando la sorgente avvisa.
 * - iscrivi: avvia un timer che scatta allo scoccare del minuto, avvisa
 *   React e si riprogramma; restituisce la funzione che lo ferma
 *   (React la chiama quando nessun componente usa più l'ora)
 * - istantanea: il minuto corrente come numero. Deve restare UGUALE
 *   finché il minuto non cambia: React confronta le istantanee, e un
 *   new Date() sarebbe sempre "diverso" → ridisegno all'infinito
 */
import { useSyncExternalStore } from "react"

const MINUTO = 60_000

function iscrivi(avvisa: () => void) {
  let timer: number
  const programma = () => {
    const mancano = MINUTO - (Date.now() % MINUTO)
    timer = window.setTimeout(() => {
      avvisa()
      programma()
    }, mancano)
  }
  programma()
  return () => window.clearTimeout(timer)
}

const istantanea = () => Math.floor(Date.now() / MINUTO) * MINUTO

export function useOra(): Date {
  return new Date(useSyncExternalStore(iscrivi, istantanea))
}
