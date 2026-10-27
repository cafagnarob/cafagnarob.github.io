/*
 * Interfaccia dello schermo
 * Compare a tutto schermo quando la camera è entrata nello schermo
 * (schermo.acceso) e sceglie cosa mostrare:
 * - "pc" → Desktop (icone dei progetti, barra delle applicazioni)
 * - "telefono" → HomeTelefono (griglia di app, barra di stato)
 *
 * - La dissolvenza d'ingresso è un'animazione CSS al montaggio:
 *   nessuno stato da gestire.
 * - Si esce con Esc o con "←" (touch), gestiti da esci().
 */
import { useAppSelector } from "../../store/hooks"

import stili from "./InterfacciaSchermo.module.css"
import { Desktop } from "./schermo/desktop/Desktop"
import { HomeTelefono } from "./schermo/telefono/HomeTelefono"

export function InterfacciaSchermo() {
  const schermo = useAppSelector((s) => s.scena.schermo)
  if (!schermo?.acceso) return null

  return (
    <div className={stili.interfaccia}>
      {schermo.nome === "pc" ? <Desktop /> : <HomeTelefono />}
    </div>
  )
}
