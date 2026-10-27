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
import stili from "./BarraApplicazioni.module.css"

type Props = { onApri?: (progetto: Progetto) => void }

export function BarraApplicazioni({ onApri }: Props) {
  const ora = useOra()

  return (
    <footer className={stili.barra}>
      <div className={stili.centro}>
        <span className={stili.start} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
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

      <time className={stili.orologio} dateTime={ora.toISOString()}>
        <span>
          {ora.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>{ora.toLocaleDateString("it-IT")}</span>
      </time>
    </footer>
  )
}
