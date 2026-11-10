/*
 * Barra di stato del telefono
 * Ora reale a sinistra (useOra), segnale e batteria a destra, disegnati
 * in CSS (decorativi, nascosti agli screen reader).
 */
import { useOra } from "../comuni/useOra"
import { ComandoVolume } from "../comuni/volume/ComandoVolume"
import stili from "./BarraStato.module.css"

export function BarraStato() {
  const ora = useOra()

  return (
    <div className={stili.barra}>
      <time dateTime={ora.toISOString()}>
        {ora.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <span className={stili.indicatori}>
        <ComandoVolume variante="telefono" />
        <span className={stili.segnale}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={stili.batteria}>
          <i />
        </span>
      </span>
    </div>
  )
}
