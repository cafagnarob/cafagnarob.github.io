/*
 * Ingresso (pagina iniziale e caricamento)
 * Copre la scena mentre carica dietro di lei.
 *   caricamento → insegna spenta (tubo grigio) e percentuale
 *   pronto      → l'insegna si accende sfarfallando ed è cliccabile
 *   clic        → entra() (audio + ambiente) e dissolvenza della pagina
 *   fine        → al termine della dissolvenza il componente sparisce
 *
 * - useProgress (drei) segue i caricamenti di useGLTF e useTexture;
 *   funziona anche fuori dal Canvas.
 * - "pronto" = niente più in caricamento e almeno un elemento caricato
 *   (all'avvio, prima che parta il primo, active è già false).
 * - Lo stato "in uscita" è locale: riguarda solo l'animazione di questa
 *   pagina; nello store va solo "entrato".
 */
import { useState } from "react"
import { useProgress } from "@react-three/drei"
import { useAppDispatch } from "../../store/hooks"
import { entra } from "../../store/azioniScena"
import { SOTTOTITOLO, TESTO_INSEGNA, TITOLO } from "../../config/ingresso"
import stili from "./Ingresso.module.css"

type Fase = "attesa" | "uscita" | "finito"

export function Ingresso() {
  const dispatch = useAppDispatch()
  const { active, progress, loaded } = useProgress()
  const [fase, setFase] = useState<Fase>("attesa")

  if (fase === "finito") return null

  const pronto = !active && loaded > 0

  return (
    <div
      className={`${stili.ingresso} ${fase === "uscita" ? stili.uscita : ""}`}
      onTransitionEnd={() => {
        if (fase === "uscita") setFase("finito")
      }}
    >
      <button
        type="button"
        className={`${stili.insegna} ${pronto ? stili.accesa : ""}`}
        disabled={!pronto || fase !== "attesa"}
        onClick={() => {
          setFase("uscita")
          dispatch(entra())
        }}
      >
        {TESTO_INSEGNA}
      </button>

      <p className={stili.titolo}>{TITOLO}</p>
      <p className={stili.sottotitolo}>
        {pronto ? SOTTOTITOLO : `Caricamento ${Math.round(progress)}%`}
      </p>
    </div>
  )
}
