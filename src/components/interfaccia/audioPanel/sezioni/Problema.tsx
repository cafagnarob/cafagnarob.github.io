/*
 * 03 · Il problema
 * Testo del problema a sinistra; a destra i cinque obiettivi numerati,
 * separati da linee sottili, come una scheda tecnica.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function Problema() {
  const { problema } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-problema" tono="chiara" etichetta="Il problema" className={stili.dueColonne}>
      <div>
        <p className={stili.etichetta}>03 — il problema</p>
        <h2 className={stili.titolo}>Un controllo che non rompa l'atmosfera.</h2>
        <p className={stili.testo}>{problema.testo}</p>
      </div>

      <ol className={stili.elencoNumerato}>
        {problema.obiettivi.map((obiettivo, i) => (
          <li key={obiettivo}>
            <span className={stili.numero}>{String(i + 1).padStart(2, "0")}</span>
            {obiettivo}
          </li>
        ))}
      </ol>
    </Sezione>
  )
}
