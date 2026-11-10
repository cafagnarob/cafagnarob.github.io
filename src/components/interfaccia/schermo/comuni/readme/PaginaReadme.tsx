/*
 * Pagina README
 * La pagina "sito" di un progetto costruita dal suo README su GitHub,
 * in uno dei temi (readme.tema, "pixel" se manca):
 * - pixel: pixel art rosa, Press Start 2P (The Worst Date)
 * - terminale: fosfori verdi con righe di scansione, VT323 (ORBITAL)
 * Il tema è una classe che definisce variabili CSS (colori, font): va
 * messa su OGNI contenitore radice, cioè la pagina e il livello del
 * gioco, perché le variabili si ereditano solo verso l'interno.
 *
 * - il Markdown (con l'HTML che contiene) diventa React (react-markdown,
 *   remark-gfm per tabelle e liste di attività, rehype-raw per l'HTML)
 * - i percorsi relativi delle immagini diventano assoluti (urlTransform)
 * - il `codice in linea` uguale a readme.avvio diventa il pulsante che
 *   avvia il gioco (SitoIncorporato) al posto della pagina
 * - con giocabile = false (telefono, progetti con readme.soloComputer)
 *   lo stesso punto diventa un pulsante spento con l'avviso "Gioca da
 *   computer": il README resta leggibile
 * - i link si aprono in una nuova scheda
 *
 * Il testo arriva con use(): il componente "sospende" finché il README
 * non è scaricato, e <Suspense> mostra l'attesa.
 * Esportata come default: Browser la carica con lazy(), così le
 * librerie del Markdown si scaricano solo quando servono.
 */
import { Suspense, use, useState } from "react"
import Markdown, { defaultUrlTransform } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Progetto } from "../../../../../data/progetti"
import { SitoIncorporato } from "../SitoIncorporato"
import { caricaReadme } from "./caricaReadme"
import stili from "./PaginaReadme.module.css"
import { createPortal } from "react-dom"

type Readme = NonNullable<Progetto["readme"]>

type Props = {
  progetto: Progetto
  /* false: il gioco non parte, compare "Gioca da computer" */
  giocabile?: boolean
}

export default function PaginaReadme({ progetto, giocabile = true }: Props) {
  const [inGioco, setInGioco] = useState(false)
  const { readme, incorpora } = progetto
  if (!readme) return null

  // Classe del tema: sulla pagina e sul livello del gioco (le variabili
  // CSS si ereditano solo verso l'interno, e il gioco è fuori, nel body)
  const tema = stili[readme.tema ?? "pixel"]

  return (
    <div className={`${stili.pagina} ${tema}`}>
      <Suspense fallback={<p className={stili.attesa}>LOADING…</p>}>
        <Contenuto
          readme={readme}
          codice={progetto.link?.codice}
          onAvvia={incorpora && giocabile ? () => setInGioco(true) : undefined}
          soloComputer={Boolean(incorpora) && !giocabile}
        />
      </Suspense>

      {/* Gioco a tutto schermo: portale nel body, fuori dalla finestra del
          browser (che lo taglierebbe). Il README resta montato sotto:
          tornando, si ritrova alla stessa posizione di scorrimento */}
      {inGioco &&
        incorpora &&
        createPortal(
          <div
            className={`${stili.gioco} ${tema}`}
            role="dialog"
            aria-label={progetto.nome}
          >
            <SitoIncorporato src={incorpora} titolo={progetto.nome} />
            <button
              type="button"
              className={stili.esciGioco}
              onClick={() => setInGioco(false)}
            >
              ◀ README
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}

type PropsContenuto = {
  readme: Readme
  codice?: string
  onAvvia?: () => void
  soloComputer: boolean
}

function Contenuto({ readme, codice, onAvvia, soloComputer }: PropsContenuto) {
  const testo = use(caricaReadme(readme.url))

  if (testo === null) {
    return (
      <p className={stili.attesa}>
        README non disponibile.{" "}
        {codice && (
          <a href={codice} target="_blank" rel="noopener noreferrer">
            Leggilo su GitHub
          </a>
        )}
      </p>
    )
  }

  // "./Girls1/x.gif" → "https://…/quiz_game/main/Girls1/x.gif".
  // defaultUrlTransform scarta poi gli schemi pericolosi (javascript:…)
  const assoluto = (url: string) => {
    try {
      return defaultUrlTransform(new URL(url, readme.base).href)
    } catch {
      return ""
    }
  }

  return (
    <div className={stili.readme}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={assoluto}
        components={{
          code: ({ children }) => {
            const eAvvio = String(children).trim() === readme.avvio
            if (eAvvio && onAvvia) {
              return (
                <button type="button" className={stili.avvio} onClick={onAvvia}>
                  {children}
                </button>
              )
            }
            if (eAvvio && soloComputer) {
              return (
                <span className={stili.avvioBloccato}>
                  <span className={stili.etichettaBloccata}>{children}</span>
                  <span className={stili.nota}>🖥 Gioca da computer</span>
                </span>
              )
            }
            return <code>{children}</code>
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {testo}
      </Markdown>
    </div>
  )
}
