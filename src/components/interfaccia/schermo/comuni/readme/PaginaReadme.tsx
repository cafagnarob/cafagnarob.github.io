/*
 * Pagina README
 * La pagina "sito" di un progetto costruita dal suo README su GitHub,
 * nello stile del gioco (pixel art, Press Start 2P):
 * - il Markdown (con l'HTML che contiene) diventa React (react-markdown,
 *   remark-gfm per le tabelle, rehype-raw per l'HTML)
 * - i percorsi relativi delle immagini diventano assoluti (urlTransform)
 * - il `codice in linea` uguale a readme.avvio diventa un pulsante:
 *   il clic sostituisce la pagina con il gioco (SitoIncorporato)
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

type Readme = NonNullable<Progetto["readme"]>

export default function PaginaReadme({ progetto }: { progetto: Progetto }) {
  const [inGioco, setInGioco] = useState(false)
  const { readme, incorpora } = progetto
  if (!readme) return null

  if (inGioco && incorpora) {
    return (
      <div className={stili.gioco}>
        <SitoIncorporato src={incorpora} titolo={progetto.nome} />
        <button
          type="button"
          className={stili.esciGioco}
          onClick={() => setInGioco(false)}
        >
          ◀ README
        </button>
      </div>
    )
  }

  return (
    <div className={stili.pagina}>
      <Suspense fallback={<p className={stili.attesa}>LOADING…</p>}>
        <Contenuto
          readme={readme}
          codice={progetto.link?.codice}
          onAvvia={incorpora ? () => setInGioco(true) : undefined}
        />
      </Suspense>
    </div>
  )
}

type PropsContenuto = {
  readme: Readme
  codice?: string
  onAvvia?: () => void
}

function Contenuto({ readme, codice, onAvvia }: PropsContenuto) {
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
          code: ({ children }) =>
            onAvvia && String(children).trim() === readme.avvio ? (
              <button type="button" className={stili.avvio} onClick={onAvvia}>
                {children}
              </button>
            ) : (
              <code>{children}</code>
            ),
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
