/*
 * Visore media (lightbox)
 * Mostra a tutto schermo una foto o un video di una raccolta e permette
 * di scorrere tra tutti gli elementi della stessa raccolta.
 *
 * Come scorre: tutti i media stanno in fila in una "pista" orizzontale
 * con scroll-snap. È il browser a gestire lo swipe con il dito, l'inerzia
 * e l'aggancio a ogni immagine; noi scriviamo solo:
 * - le frecce (pulsanti e tastiera) → pista.scrollTo(...)
 * - il contatore "3 / 11" → letto dalla posizione dello scroll (onScroll)
 *
 * È un secondo <dialog> modale, aperto sopra la finestra NOIA: il top
 * layer li impila da solo. Esc chiude solo il visore, perché il browser
 * manda l'evento al dialog più in alto.
 *
 * Apertura: il callback ref del dialog chiama showModal() e porta la
 * pista sull'elemento cliccato. Gira dopo i ref dei figli, quindi
 * pistaRef è già pronto. useCallback lo rende stabile: React non lo
 * richiama a ogni render (altrimenti la pista tornerebbe indietro).
 */
import { useCallback, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import type { MediaNoia } from "../../../data/noia"
import { useMenoMovimento } from "./useMenoMovimento"
import stili from "./VisoreMedia.module.css"

type Props = {
  titolo: string
  media: MediaNoia[]
  iniziale: number
  onChiudi: () => void
}

export function VisoreMedia({ titolo, media, iniziale, onChiudi }: Props) {
  const [indice, setIndice] = useState(iniziale)
  const pistaRef = useRef<HTMLDivElement>(null)
  const menoMovimento = useMenoMovimento()
  const ultimo = media.length - 1

  const apri = useCallback(
    (dialogo: HTMLDialogElement | null) => {
      if (!dialogo || dialogo.open) return
      dialogo.showModal()
      const pista = pistaRef.current
      if (pista) pista.scrollLeft = iniziale * pista.clientWidth
    },
    [iniziale],
  )

  /* Porta la pista sull'elemento `nuovo` (bloccato tra primo e ultimo) */
  const vaiA = (nuovo: number) => {
    const pista = pistaRef.current
    if (!pista) return
    const bersaglio = Math.min(Math.max(nuovo, 0), ultimo)
    pista.scrollTo({
      left: bersaglio * pista.clientWidth,
      behavior: menoMovimento ? "instant" : "smooth",
    })
  }

  /* Il contatore segue lo scroll, qualunque cosa l'abbia causato:
     frecce, tastiera o dito. React ignora i set con lo stesso valore. */
  const aggiornaIndice = () => {
    const pista = pistaRef.current
    if (pista) setIndice(Math.round(pista.scrollLeft / pista.clientWidth))
  }

  const tasti = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") vaiA(indice + 1)
    else if (e.key === "ArrowLeft") vaiA(indice - 1)
    else if (e.key === "Escape") e.stopPropagation()
  }

  /* Clic sullo spazio vuoto attorno all'immagine = chiudi */
  const clicVuoto = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) onChiudi()
  }

  const corrente = media[indice]

  return (
    <dialog
      ref={apri}
      className={stili.visore}
      aria-label={`${titolo}: visore`}
      onClose={onChiudi}
      onKeyDown={tasti}
    >
      <header className={stili.barra}>
        <span className={stili.nomeFile}>{corrente?.nomeFile}</span>
        <span className={stili.contatore} aria-live="polite">
          {indice + 1} / {media.length}
        </span>
        <button
          type="button"
          className={stili.chiudi}
          onClick={onChiudi}
          aria-label="Chiudi il visore"
        >
          ✕
        </button>
      </header>

      <div
        ref={pistaRef}
        className={stili.pista}
        onScroll={aggiornaIndice}
        role="region"
        aria-roledescription="carosello"
        aria-label={titolo}
      >
        {media.map((elemento, i) => (
          <div
            key={elemento.src}
            className={stili.diapositiva}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} di ${media.length}`}
            onClick={clicVuoto}
          >
            {elemento.tipo === "video" ? (
              <video
                src={elemento.src}
                poster={elemento.poster}
                width={elemento.larghezza}
                height={elemento.altezza}
                aria-label={elemento.alt}
                controls
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={elemento.src}
                alt={elemento.alt}
                width={elemento.larghezza}
                height={elemento.altezza}
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`${stili.freccia} ${stili.precedente}`}
        onClick={() => vaiA(indice - 1)}
        disabled={indice === 0}
        aria-label="Immagine precedente"
      >
        ←
      </button>
      <button
        type="button"
        className={`${stili.freccia} ${stili.successiva}`}
        onClick={() => vaiA(indice + 1)}
        disabled={indice === ultimo}
        aria-label="Immagine successiva"
      >
        →
      </button>
    </dialog>
  )
}
