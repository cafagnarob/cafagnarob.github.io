/*
 * Schermi interattivi
 * Lo schermo che, cliccato nella sua vista, "si accende" a tutto
 * schermo con l'interfaccia HTML (desktop o telefono).
 *
 * - nome: come in Blender.
 * - capovolgi: se l'interfaccia arriva sottosopra (solo schermi sdraiati,
 *   come il telefono: il verso del lato lungo non si può dedurre).
 * Le chiavi coincidono con le viste: lo schermo "pc" si accende solo
 * nella vista "pc", "telefono" solo nella vista "telefono".
 */
export type NomeSchermo = "pc" | "telefono"

export const SCHERMI: Record<
  NomeSchermo,
  { nome: string; capovolgi?: boolean }
> = {
  pc: { nome: "screen.001" },
  telefono: { nome: "schermo_telefono" },
}
