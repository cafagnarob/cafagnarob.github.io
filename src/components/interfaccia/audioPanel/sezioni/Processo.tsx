/*
 * 04 · Il processo
 * Titolo spaziato in maiuscolo (come la reference Bach), l'immagine
 * delle iterazioni a tutta larghezza, poi i sei passi numerati in
 * griglia e il dettaglio chiave evidenziato con una barra ambra.
 */
import { CASO_AUDIO_PANEL } from "../../../../data/casoAudioPanel"
import { Sezione } from "./Sezione"
import stili from "./sezioni.module.css"

export function Processo() {
  const { processo } = CASO_AUDIO_PANEL

  return (
    <Sezione id="ap-processo" tono="scura" etichetta="Il processo" className={stili.colonna}>
      <div>
        <p className={stili.etichetta}>04 — il processo</p>
        <h2 className={stili.spaziato}>Sei iterazioni, una revisione alla volta</h2>
        <p className={stili.testo}>{processo.testo}</p>
      </div>

      <img className={stili.immagineLarga} src={processo.immagine.src} alt={processo.immagine.alt} loading="lazy" />

      <ol className={stili.passi}>
        {processo.passi.map((passo, i) => (
          <li key={passo.titolo}>
            <span className={stili.numero}>{String(i + 1).padStart(2, "0")}</span>
            <h3>{passo.titolo}</h3>
            <p>{passo.testo}</p>
          </li>
        ))}
      </ol>

      <p className={stili.evidenza}>
        <strong>Il dettaglio che fa il realismo.</strong> {processo.dettaglio}
      </p>
    </Sezione>
  )
}
