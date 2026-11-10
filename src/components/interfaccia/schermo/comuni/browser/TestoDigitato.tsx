/*
 * TestoDigitato
 * Scrive un testo una lettera alla volta, solo con CSS.
 * Ogni lettera è uno span nascosto che diventa visibile al suo turno:
 *   ritardo = --inizio + --i × --passo
 * --i è l'indice della lettera (impostato qui), --inizio e --passo
 * arrivano dal Browser (le variabili CSS si ereditano).
 * Per la durata del suo passo, l'ultima lettera scritta mostra il
 * cursore a destra: sembra che avanzi mentre si scrive.
 * Funziona con qualsiasi font perché non misura larghezze.
 * È decorativo (aria-hidden): l'indirizzo vero lo legge la barra.
 */
import type { CSSProperties } from "react"
import stili from "./TestoDigitato.module.css"

export function TestoDigitato({ testo }: { testo: string }) {
  return (
    <span aria-hidden="true">
      {[...testo].map((lettera, i) => (
        <span
          key={i}
          className={stili.lettera}
          style={{ "--i": i } as CSSProperties}
        >
          {lettera}
        </span>
      ))}
    </span>
  )
}
