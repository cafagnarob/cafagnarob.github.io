/*
 * useVoloTurntable
 * Anima il "volo 2D" del render di CLO tra il capo nell'armadio e il
 * centro dello schermo, senza modello 3D:
 * - posizione e grandezza: dal rettangolo del capo nell'armadio al centro
 * - rotazione: scorre i fotogrammi dal laterale (fotogrammaArmadio)
 *   al frontale (00), sul giro più breve
 * - luminosità: dalla penombra dell'armadio alla luce della vetrina
 *
 * Lo stile viene scritto direttamente sull'elemento a ogni fotogramma
 * (requestAnimationFrame): il movimento non causa re-render di React.
 * Solo il cambio di immagine passa da setFotogramma.
 *
 * Avvio senza useEffect: collegaPalco è un "callback ref" STABILE.
 * React lo chiama quando l'elemento compare, prima del primo disegno
 * (→ il render si posiziona sopra il capo e parte l'andata); con
 * React 19 chiama la funzione restituita quando sparisce (→ stop).
 * Deve restare stabile (useCallback), altrimenti ogni re-render
 * (es. cambio di fotogramma) lo richiamerebbe e il volo ripartirebbe.
 */
import { useCallback, useRef } from "react"
import type { Turntable } from "../../data/lavoriModa"
import type { Rettangolo } from "../../utils/rettangoloSchermo"
import {
  differenzaFotogrammi,
  easeInOutCubic,
  lerp,
  modulo,
} from "../../utils/animazione"
import { OCCUPAZIONE_SCHERMO } from "../../config/ispezione"
import {
  DURATA_VOLO_MS,
  LUMINOSITA_ARMADIO,
  LUMINOSITA_VETRINA,
  MARGINE_RITAGLIO,
} from "../../config/vetrina"

/* Spostamento dal centro dello schermo (px), scala e luminosità */
type Posa2D = { x: number; y: number; scala: number; luminosita: number }
type Fase = "andata" | "ferma" | "ritorno"

/* In vetrina: al centro, a grandezza piena */
const posaCentro = (): Posa2D => ({
  x: 0,
  y: 0,
  scala: 1,
  luminosita: LUMINOSITA_VETRINA,
})

/* Nell'armadio: centrato sul capo, con la sua altezza a schermo.
   L'altezza piena del render include il margine del ritaglio, quindi
   il capo vero occupa altezzaPiena / (1 + 2 × margine). */
function posaArmadio(capo: Rettangolo): Posa2D {
  const altezzaPiena =
    OCCUPAZIONE_SCHERMO * Math.min(window.innerWidth, window.innerHeight)
  const altezzaCapo = altezzaPiena / (1 + 2 * MARGINE_RITAGLIO)
  return {
    x: capo.x + capo.larghezza / 2 - window.innerWidth / 2,
    y: capo.y + capo.altezza / 2 - window.innerHeight / 2,
    scala: capo.altezza / altezzaCapo,
    luminosita: LUMINOSITA_ARMADIO,
  }
}

function applica(elemento: HTMLElement, posa: Posa2D) {
  elemento.style.transform = `translate(-50%, -50%) translate(${posa.x}px, ${posa.y}px) scale(${posa.scala})`
  elemento.style.filter = `brightness(${posa.luminosita})`
}

export function useVoloTurntable(
  partenza: Rettangolo,
  turntable: Turntable,
  setFotogramma: (fotogramma: number) => void,
) {
  const palco = useRef<HTMLDivElement | null>(null)
  const idAnimazione = useRef(0)
  const fase = useRef<Fase>("andata")

  /* Anima da una posa all'altra e da un fotogramma all'altro */
  const anima = useCallback(
    (
      da: Posa2D,
      a: Posa2D,
      fotoDa: number,
      fotoA: number,
      alTermine: () => void,
    ) => {
      const passi = differenzaFotogrammi(fotoDa, fotoA, turntable.fotogrammi)
      const inizio = performance.now()
      let ultimoFotogramma = -1

      const passo = (ora: number) => {
        const elemento = palco.current
        if (!elemento) return
        const t = Math.min((ora - inizio) / DURATA_VOLO_MS, 1)
        const k = easeInOutCubic(t)

        applica(elemento, {
          x: lerp(da.x, a.x, k),
          y: lerp(da.y, a.y, k),
          scala: lerp(da.scala, a.scala, k),
          luminosita: lerp(da.luminosita, a.luminosita, k),
        })

        // Cambia immagine solo quando cambia davvero il fotogramma
        const fotogramma = modulo(
          Math.round(fotoDa + passi * k),
          turntable.fotogrammi,
        )
        if (fotogramma !== ultimoFotogramma) {
          ultimoFotogramma = fotogramma
          setFotogramma(fotogramma)
        }

        if (t < 1) idAnimazione.current = requestAnimationFrame(passo)
        else alTermine()
      }

      cancelAnimationFrame(idAnimazione.current)
      idAnimazione.current = requestAnimationFrame(passo)
    },
    [turntable, setFotogramma],
  )

  /* Callback ref: l'elemento compare → posizionalo sul capo e parti */
  const collegaPalco = useCallback(
    (elemento: HTMLDivElement | null) => {
      palco.current = elemento
      if (!elemento) return
      const inizio = posaArmadio(partenza)
      applica(elemento, inizio) // subito, prima del primo disegno: niente salto
      fase.current = "andata"
      anima(inizio, posaCentro(), turntable.fotogrammaArmadio, 0, () => {
        fase.current = "ferma"
      })
      return () => cancelAnimationFrame(idAnimazione.current)
    },
    [partenza, turntable, anima],
  )

  /* Ritorno nell'armadio dal fotogramma attuale (solo se fermo al centro) */
  const avviaRitorno = (fotogrammaAttuale: number, alTermine: () => void) => {
    if (fase.current !== "ferma") return false
    fase.current = "ritorno"
    anima(
      posaCentro(),
      posaArmadio(partenza),
      fotogrammaAttuale,
      turntable.fotogrammaArmadio,
      alTermine,
    )
    return true
  }

  /* Il capo è fermo al centro? (trascinamento consentito solo allora) */
  const fermo = useCallback(() => fase.current === "ferma", [])

  return { collegaPalco, avviaRitorno, fermo }
}
