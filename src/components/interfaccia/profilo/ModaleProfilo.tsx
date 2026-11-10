/*
 * Modale del profilo: un fascicolo di fogli
 * Si apre nella vista del letto, quando la camera è arrivata
 * (vistaRaggiunta). Ogni sezione è un foglio disegnato in Photoshop;
 * le linguette (schede) sul bordo scelgono il foglio.
 *
 * - Cambio sezione: il foglio scelto si "sfila" dalla pila e torna
 *   davanti (classe attivo → animazione sfila); quello che era davanti
 *   rientra nella pila (classe uscente → animazione rientra). Per questo
 *   si ricordano due indici: attivo e precedente.
 * - A riposo ogni foglio ha la sua posizione e rotazione (--dx, --dy,
 *   --angolo): la pila "disordinata" come su una scrivania.
 * - Schede accessibili (tablist / tab / tabpanel): frecce per cambiare
 *   foglio, Home / Fine. I fogli non attivi sono "inert": il loro
 *   contenuto non si raggiunge con il Tab.
 * - Monta solo quando è aperto: riparte dal primo foglio e autoFocus
 *   porta il focus sulla prima linguetta, senza useEffect.
 * - La foto esce dal portafoto e si affianca al fascicolo
 *   (FotoInPrimoPiano); dietro, il velo sfoca tutta la stanza.
 * - Si chiude con la ×, il clic sullo sfondo, Esc e "←".
 */
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { esci } from "../../../store/azioniScena"
import { VISTA_PROFILO } from "../../../config/profilo"
import { PROFILO } from "../../../data/profilo"
import { SezioneChiSono } from "./SezioneChiSono"
import { SezionePercorso } from "./SezionePercorso"
import { SezioneCompetenze } from "./SezioneCompetenze"
import { SezioneContatti } from "./SezioneContatti"
import { FotoInPrimoPiano } from "./FotoInPrimoPiano"
import { Fermaglio } from "./Fermaglio"
import stili from "./ModaleProfilo.module.css"

type Foglio = {
  id: string
  etichetta: string
  carta: string // classe CSS: immagine del foglio e colore della linguetta
  riposo: { dx: number; dy: number; angolo: number } // posizione nella pila
  contenuto: () => ReactNode
}

/* I fogli, dall'alto della pila verso il basso */
const FOGLI: Foglio[] = [
  {
    id: "chi-sono",
    etichetta: "Chi sono",
    carta: stili.cartaPanna,
    riposo: { dx: 0, dy: 0, angolo: -1 },
    contenuto: () => <SezioneChiSono paragrafi={PROFILO.chiSono} />,
  },
  {
    id: "percorso",
    etichetta: "Percorso",
    carta: stili.cartaQuaderno,
    riposo: { dx: -14, dy: -10, angolo: 2 },
    contenuto: () => <SezionePercorso tappe={PROFILO.percorso} />,
  },
  {
    id: "competenze",
    etichetta: "Competenze",
    carta: stili.cartaCartoncino,
    riposo: { dx: 12, dy: 12, angolo: -3 },
    contenuto: () => <SezioneCompetenze gruppi={PROFILO.competenze} />,
  },
  {
    id: "contatti",
    etichetta: "Contatti",
    carta: `${stili.cartaKraft} ${stili.aRighe}`,
    riposo: { dx: -6, dy: 18, angolo: 1.5 },
    contenuto: () => (
      <SezioneContatti contatti={PROFILO.contatti} cv={PROFILO.cv} />
    ),
  },
]

export function ModaleProfilo() {
  const aperto = useAppSelector(
    (s) =>
      s.scena.entrato &&
      s.scena.vista === VISTA_PROFILO &&
      s.scena.vistaRaggiunta,
  )
  return aperto ? <Fascicolo /> : null
}

function Fascicolo() {
  const dispatch = useAppDispatch()
  const [fogli, setFogli] = useState<{
    attivo: number
    precedente: number | null
  }>({
    attivo: 0,
    precedente: null,
  })
  const linguette = useRef<(HTMLButtonElement | null)[]>([])

  /* Porta davanti il foglio i (in cerchio); quello attuale rientra */
  const vaiAFoglio = (i: number, spostaFocus = true) => {
    const indice = (i + FOGLI.length) % FOGLI.length
    if (indice !== fogli.attivo)
      setFogli({ attivo: indice, precedente: fogli.attivo })
    if (spostaFocus) linguette.current[indice]?.focus()
  }

  const tastiLinguette = (e: KeyboardEvent) => {
    const azioni: Record<string, () => void> = {
      ArrowRight: () => vaiAFoglio(fogli.attivo + 1),
      ArrowDown: () => vaiAFoglio(fogli.attivo + 1),
      ArrowLeft: () => vaiAFoglio(fogli.attivo - 1),
      ArrowUp: () => vaiAFoglio(fogli.attivo - 1),
      Home: () => vaiAFoglio(0),
      End: () => vaiAFoglio(FOGLI.length - 1),
    }
    const azione = azioni[e.key]
    if (azione) {
      e.preventDefault()
      azione()
    }
  }

  return (
    <div className={stili.sfondo} onClick={() => dispatch(esci())}>
      <div className={stili.velo} aria-hidden="true" />
      <FotoInPrimoPiano />

      <div
        className={stili.fascicolo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profilo-nome"
        onClick={(e) => e.stopPropagation()} // un clic dentro non chiude
      >
        <h2 id="profilo-nome" className={stili.nascosto}>
          Profilo di {PROFILO.nome}
        </h2>

        <button
          type="button"
          className={stili.chiudi}
          aria-label="Chiudi il profilo"
          onClick={() => dispatch(esci())}
        >
          ×
        </button>

        {/* Linguette: le schede, sul bordo del fascicolo */}
        <div
          className={stili.linguette}
          role="tablist"
          aria-label="Sezioni del profilo"
          aria-orientation="vertical"
          onKeyDown={tastiLinguette}
        >
          {FOGLI.map(({ id, etichetta, carta }, i) => (
            <button
              key={id}
              ref={(elemento) => {
                linguette.current[i] = elemento
              }}
              type="button"
              role="tab"
              id={`linguetta-${id}`}
              aria-selected={i === fogli.attivo}
              aria-controls={`foglio-${id}`}
              tabIndex={i === fogli.attivo ? 0 : -1}
              autoFocus={i === 0}
              className={`${stili.linguetta} ${carta} ${i === fogli.attivo ? stili.linguettaAttiva : ""}`}
              style={{ "--posizione": i } as CSSProperties}
              onClick={() => vaiAFoglio(i, false)}
            >
              {etichetta}
            </button>
          ))}
        </div>

        {/* La pila dei fogli */}
        {FOGLI.map((foglio, i) => {
          const attivo = i === fogli.attivo
          const uscente = i === fogli.precedente
          return (
            <article
              data-foglio={foglio.id}
              key={foglio.id}
              id={`foglio-${foglio.id}`}
              role="tabpanel"
              aria-labelledby={`linguetta-${foglio.id}`}
              inert={!attivo}
              className={`${stili.foglio} ${attivo ? stili.attivo : ""} ${uscente ? stili.uscente : ""}`}
              style={
                {
                  "--dx": `${foglio.riposo.dx}px`,
                  "--dy": `${foglio.riposo.dy}px`,
                  "--angolo": `${foglio.riposo.angolo}deg`,
                  "--strato": FOGLI.length - i,
                } as CSSProperties
              }
            >
              <div className={`${stili.carta} ${foglio.carta}`}>
                {/* Testata e testo scorrono insieme (anche le righe del quaderno) */}
                <div className={stili.contenuto} tabIndex={0}>
                  <header className={stili.testataFoglio}>
                    {/* Primo foglio: nome e ruolo scritti sul post-it */}
                    {i === 0 && (
                      <div className={stili.postit}>
                        <p className={stili.nome}>{PROFILO.nome}</p>
                        <p className={stili.ruolo}>{PROFILO.ruolo}</p>
                      </div>
                    )}
                    <h3 className={stili.titoloFoglio}>{foglio.etichetta}</h3>
                  </header>
                  {/* Il testo: su telefono, in "Chi sono", è l'unica parte che scorre */}
                  <div className={stili.testoScorrevole}>
                    {foglio.contenuto()}
                  </div>
                </div>
              </div>
            </article>
          )
        })}

        <Fermaglio className={stili.fermaglio} />
      </div>
    </div>
  )
}
