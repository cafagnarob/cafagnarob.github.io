/*
 * Interfaccia dello schermo (PROVA)
 * Compare a tutto schermo quando la camera è entrata nello schermo
 * (schermo.acceso). Per ora è un segnaposto: qui arriveranno il
 * desktop (pc) e la home del telefono con i progetti.
 *
 * - La dissolvenza d'ingresso è un'animazione CSS al montaggio:
 *   nessuno stato da gestire.
 * - Si esce con Esc o con "←" (touch), gestiti da esci().
 */
import { useAppSelector } from "../../store/hooks"
import stili from "./InterfacciaSchermo.module.css"

export function InterfacciaSchermo() {
  const schermo = useAppSelector((s) => s.scena.schermo)
  if (!schermo?.acceso) return null

  return (
    <div className={`${stili.interfaccia} ${stili[schermo.nome]}`}>
      <p>{schermo.nome === "pc" ? "Desktop (prova)" : "Telefono (prova)"}</p>
      <p className={stili.aiuto}>Esc per uscire</p>
    </div>
  )
}
