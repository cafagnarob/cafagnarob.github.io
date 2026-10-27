/*
 * Comando del volume nelle interfacce degli schermi
 * Pulsante con l'altoparlante che apre un pannello con muto, cursore
 * e percentuale.
 *
 * Apertura e chiusura le gestisce il browser con l'attributo popover:
 * - popoverTarget sul pulsante: apre e chiude il pannello
 * - popover="auto": un clic fuori lo chiude; sta nel "top layer",
 *   sopra tutto, anche fuori da contenitori con backdrop-filter
 * Nessuno stato React per l'apertura. useId genera l'id che collega
 * pulsante e pannello.
 *
 * - variante "desktop": nella barra delle applicazioni, pannello sopra
 * - variante "telefono": nella barra di stato, pannello sotto
 */
import { useId } from "react"
import { useVolume } from "./useVolume"
import { IconaVolume } from "./IconaVolume"
import stili from "./ComandoVolume.module.css"

type Props = { variante: "desktop" | "telefono" }

const CLASSI = {
  desktop: { pulsante: stili.pulsanteDesktop, pannello: stili.pannelloDesktop },
  telefono: {
    pulsante: stili.pulsanteTelefono,
    pannello: stili.pannelloTelefono,
  },
}

export function ComandoVolume({ variante }: Props) {
  const id = useId()
  const { muto, livello, alterna, imposta } = useVolume()
  const percentuale = Math.round(livello * 100)
  const classi = CLASSI[variante]

  return (
    <>
      <button
        type="button"
        className={`${stili.pulsante} ${classi.pulsante}`}
        popoverTarget={id}
        aria-label={`Volume ${percentuale}%`}
      >
        <IconaVolume livello={livello} className={stili.icona} />
      </button>

      <div
        id={id}
        popover="auto"
        className={`${stili.pannello} ${classi.pannello}`}
      >
        <button
          type="button"
          className={stili.muto}
          onClick={alterna}
          aria-pressed={muto}
          aria-label={muto ? "Attiva l'audio" : "Disattiva l'audio"}
        >
          <IconaVolume livello={livello} className={stili.icona} />
        </button>
        <input
          type="range"
          className={stili.cursore}
          min={0}
          max={1}
          step={0.01}
          value={livello}
          aria-label="Volume"
          onChange={(e) => imposta(Number(e.target.value))}
        />
        <span className={stili.percentuale} aria-hidden="true">
          {percentuale}
        </span>
      </div>
    </>
  )
}
