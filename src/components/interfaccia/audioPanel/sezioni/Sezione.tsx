/*
 * Sezione della pagina Audio Panel
 * Il contenitore di ogni sezione: alta almeno quanto la finestra, fondo
 * chiaro o scuro (tono), id per il menu e data-sezione per l'indicatore.
 */
import type { ReactNode } from "react"
import stili from "./sezioni.module.css"

type Props = {
  id: string
  tono: "chiara" | "scura"
  etichetta: string
  className?: string
  children: ReactNode
}

export function Sezione({ id, tono, etichetta, className = "", children }: Props) {
  return (
    <section
      id={id}
      data-sezione
      aria-label={etichetta}
      className={`${stili.sezione} ${stili[tono]} ${className}`}
    >
      {children}
    </section>
  )
}
