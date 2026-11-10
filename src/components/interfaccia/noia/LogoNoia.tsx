/*
 * Logo NOIA
 * Il logo condensato disegnato con una maschera CSS: il PNG decide la
 * forma, il colore lo decide `background-color` (di default la crema).
 * Così lo stesso file serve per lo sfondo animato, la finestra e
 * qualsiasi colore futuro, senza esportare varianti.
 */
import type { CSSProperties } from "react"
import { IDENTITA_NOIA } from "../../../data/noia"
import stili from "./LogoNoia.module.css"

type Props = { className?: string }

export function LogoNoia({ className = "" }: Props) {
  return (
    <span
      role="img"
      aria-label="noia"
      className={`${stili.logo} ${className}`}
      style={{ "--maschera": `url(${IDENTITA_NOIA.logo})` } as CSSProperties}
    />
  )
}
