/*
 * useVariantePannello
 * "desktop" o "mobile" secondo MEDIA_DESKTOP, aggiornato quando la
 * finestra passa la soglia. Senza useEffect: useSyncExternalStore si
 * abbona all'evento "change" della media query.
 * Serve in JS (non solo in CSS) perché le due varianti hanno un numero
 * diverso di colonne: 25 bande contro 2 canali.
 */
import { useSyncExternalStore } from "react"
import {
  MEDIA_DESKTOP,
  type VariantePannello,
} from "../../../config/pannelloAudio"

const query = window.matchMedia(MEDIA_DESKTOP)

const iscrivi = (avvisa: () => void) => {
  query.addEventListener("change", avvisa)
  return () => query.removeEventListener("change", avvisa)
}

export function useVariantePannello(): VariantePannello {
  return useSyncExternalStore(iscrivi, () => query.matches)
    ? "desktop"
    : "mobile"
}
