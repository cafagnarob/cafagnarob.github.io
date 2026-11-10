/*
 * Barra delle applicazioni
 * Ricreata in HTML come quella di Windows 11 (quella della foto è
 * tagliata via):
 * - al centro: il pulsante Start (decorativo) e i progetti "fissati",
 *   gli stessi delle icone sul desktop
 * - a destra: ora e data reali, aggiornate a ogni minuto (useOra)
 * Il vetro smerigliato è backdrop-filter: sfoca lo sfondo sotto la barra.
 */
import { PROGETTI, type Progetto } from "../../../../data/progetti"
import { IconaProgetto } from "../comuni/IconaProgetto"
import { useOra } from "../comuni/useOra"
import { ComandoVolume } from "../comuni/volume/ComandoVolume"
import stili from "./BarraApplicazioni.module.css"

type Props = {
  onApri?: (progetto: Progetto) => void
  onStart?: () => void
  menuAperto?: boolean
}

export function BarraApplicazioni({
  onApri,
  onStart,
  menuAperto = false,
}: Props) {
  const ora = useOra()

  return (
    <footer className={stili.barra}>
      <div className={stili.centro}>
        <button
          type="button"
          className={stili.start}
          onClick={onStart}
          aria-label="Start"
          aria-expanded={menuAperto}
        >
          <i />
          <i />
          <i />
          <i />
        </button>
        {PROGETTI.map((progetto) => (
          <button
            key={progetto.id}
            type="button"
            className={stili.app}
            aria-label={`Apri ${progetto.nome}`}
            onClick={() => onApri?.(progetto)}
          >
            <IconaProgetto progetto={progetto} className={stili.iconaApp} />
          </button>
        ))}
      </div>

      <span className={stili.vassoio}>
        <ComandoVolume variante="desktop" />
        <time className={stili.orologio} dateTime={ora.toISOString()}>
          <span>
            {ora.toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>{ora.toLocaleDateString("it-IT")}</span>
        </time>
      </span>
    </footer>
  )
}
