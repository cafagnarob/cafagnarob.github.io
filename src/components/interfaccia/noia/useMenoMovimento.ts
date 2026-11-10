/*
 * useMenoMovimento
 * true se l'utente ha chiesto al sistema di ridurre le animazioni
 * (prefers-reduced-motion). Si aggiorna da solo se cambia l'impostazione.
 * useSyncExternalStore legge un valore che vive fuori da React (la
 * media query) e si iscrive ai suoi cambiamenti: niente useEffect.
 */
import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function iscriviti(avvisa: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", avvisa)
  return () => media.removeEventListener("change", avvisa)
}

const leggi = () => window.matchMedia(QUERY).matches

export function useMenoMovimento() {
  return useSyncExternalStore(iscriviti, leggi, () => false)
}
