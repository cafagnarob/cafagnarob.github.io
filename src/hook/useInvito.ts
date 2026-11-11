/*
 * useInvito
 * Decide quando gli alone "respirano" e da quando contare il tempo.
 * Attivo solo se:
 * - la camera è nella panoramica E ci è arrivata (movimento finito)
 * - l'utente è entrato nella stanza
 * - "riduci movimento" non è attivo
 *
 * Restituisce una funzione da chiamare in useFrame con l'orologio:
 * - null se l'invito è spento
 * - altrimenti i secondi passati da quando è (ri)partito
 * Ogni volta che l'invito si spegne, il punto di partenza si azzera:
 * al ritorno nella panoramica il respiro ricomincia dal primo oggetto.
 *
 * Stanza e armadio lo usano ciascuno nel proprio useFrame: si attivano
 * nello stesso aggiornamento di Redux, quindi partono dallo stesso
 * fotogramma e restano sincronizzati.
 */
import { useRef } from "react"
import { useAppSelector } from "../store/hooks"
import { useMenoMovimento } from "./useMenoMovimento"

export function useInvito() {
  const vista = useAppSelector((s) => s.scena.vista)
  const vistaRaggiunta = useAppSelector((s) => s.scena.vistaRaggiunta)
  const entrato = useAppSelector((s) => s.scena.entrato)
  const menoMovimento = useMenoMovimento()
  const inizio = useRef<number | null>(null)

  const attivo =
    vista === "panoramica" && vistaRaggiunta && entrato && !menoMovimento

  return (orologio: number): number | null => {
    if (!attivo) {
      inizio.current = null // si riparte da zero al prossimo ritorno
      return null
    }
    inizio.current ??= orologio // primo fotogramma dopo il ritorno
    return orologio - inizio.current
  }
}
