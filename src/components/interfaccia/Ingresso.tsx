/*
 * Ingresso (pagina iniziale e caricamento)
 * Due render di Blender sovrapposti: l'insegna SPENTA sotto, ACCESA sopra.
 *   caricamento → l'immagine accesa compare piano seguendo la percentuale,
 *                 fino a LUCE_MASSIMA_CARICAMENTO: il tubo "si scalda"
 *   pronto      → l'insegna sfarfalla e si accende del tutto; la scena
 *                 diventa cliccabile (la porta o l'insegna, tutto vale)
 *   clic        → entra() (audio + ambiente) e dissolvenza della pagina
 *
 * - Visibile quando non si è entrati (store: entrato): sparisce con
 *   "Entra", ricompare con l'insegna "Exit" della stanza. Resta sempre
 *   montata: quando è nascosta il CSS la toglie anche dal disegno
 *   (visibility: hidden a dissolvenza finita).
 * - <picture>: il browser scarica solo il formato giusto (verticale o
 *   orizzontale), grazie alla media query.
 * - L'opacità segue useProgress con una variabile CSS (--luce): niente
 *   stato aggiuntivo, la transizione la fa il CSS.
 */
import type { CSSProperties } from "react"
import { useProgress } from "@react-three/drei"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { entra } from "../../store/azioniScena"
import {
  FUOCO_DESKTOP,
  FUOCO_MOBILE,
  IMMAGINI,
  LUCE_MASSIMA_CARICAMENTO,
  SOTTOTITOLO,
  TITOLO,
} from "../../config/ingresso"
import stili from "./Ingresso.module.css"

type Stato = "spento" | "acceso"

const VERTICALE = "(orientation: portrait)"

/* Un render, nel formato giusto per lo schermo */
function Render({ stato, classe }: { stato: Stato; classe: string }) {
  return (
    <picture>
      <source media={VERTICALE} srcSet={IMMAGINI.mobile[stato]} />
      <img
        className={classe}
        src={IMMAGINI.desktop[stato]}
        alt=""
        draggable={false}
      />
    </picture>
  )
}

export function Ingresso() {
  const dispatch = useAppDispatch()
  const entrato = useAppSelector((s) => s.scena.entrato)
  const { active, progress, loaded } = useProgress()

  const pronto = !active && loaded > 0
  const luce = pronto ? 1 : (progress / 100) * LUCE_MASSIMA_CARICAMENTO

  return (
    <div
      className={`${stili.ingresso} ${entrato ? stili.uscita : ""}`}
      aria-hidden={entrato}
      style={
        {
          "--luce": luce,
          "--fuoco-desktop": FUOCO_DESKTOP,
          "--fuoco-mobile": FUOCO_MOBILE,
        } as CSSProperties
      }
    >
      <Render stato="spento" classe={stili.render} />
      <Render
        stato="acceso"
        classe={`${stili.render} ${stili.acceso} ${pronto ? stili.pronto : ""}`}
      />

      <div className={stili.testi}>
        <p className={stili.titolo}>{TITOLO}</p>
        <p className={stili.sottotitolo}>
          {pronto ? SOTTOTITOLO : `Caricamento ${Math.round(progress)}%`}
        </p>
      </div>

      {/* Tutta la scena è il pulsante: porta o insegna, si entra */}
      <button
        type="button"
        className={stili.pulsante}
        disabled={!pronto || entrato}
        aria-label="Entra"
        onClick={() => dispatch(entra())}
      />
    </div>
  )
}
