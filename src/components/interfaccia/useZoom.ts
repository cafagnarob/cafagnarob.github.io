/*
 * useZoom
 * Zoom e spostamento del render nella vetrina.
 *
 * - Lo stato (scala, spostamento x/y) sta in un ref e viene scritto
 *   direttamente sullo stile dell'elemento: rotella e dita producono
 *   decine di eventi al secondo, e così non causano re-render.
 * - zoomVerso: ingrandisce mantenendo fermo il punto indicato
 *   (cursore o centro del pizzico):
 *     spostamento' = punto − (punto − spostamento) × (scala' / scala)
 * - limita: lo spostamento non può far uscire i bordi dell'immagine
 *   dalla sua area (a scala 1 lo spostamento è sempre 0).
 * - hd: unico valore di stato React; cambia solo quando lo zoom supera
 *   o scende sotto SOGLIA_HD (setHd con lo stesso valore non causa
 *   re-render), e serve a mostrare la versione HD del fotogramma.
 * - Tutte le funzioni sono stabili (useCallback senza dipendenze che
 *   cambiano): si possono usare in listener nativi e callback ref.
 */
import { useCallback, useRef, useState } from "react"
import { SOGLIA_HD, ZOOM_MASSIMO } from "../../config/vetrina"

type StatoZoom = { scala: number; x: number; y: number }

const limitaValore = (valore: number, minimo: number, massimo: number) =>
  Math.min(Math.max(valore, minimo), massimo)

export function useZoom() {
  const elemento = useRef<HTMLDivElement | null>(null)
  const stato = useRef<StatoZoom>({ scala: 1, x: 0, y: 0 })
  const [hd, setHd] = useState(false)

  /* Scrive lo stato sullo stile (animato solo per l'azzeramento) */
  const applica = useCallback((animato: boolean) => {
    const el = elemento.current
    if (!el) return
    const { scala, x, y } = stato.current
    el.style.transition = animato ? "transform 0.3s ease-out" : "none"
    el.style.transform = `translate(${x}px, ${y}px) scale(${scala})`
    setHd(scala > SOGLIA_HD)
  }, [])

  /* I bordi dell'immagine ingrandita non possono entrare nella sua area.
     offsetWidth/Height sono le misure SENZA trasformazioni. */
  const limita = useCallback(() => {
    const el = elemento.current
    if (!el) return
    const s = stato.current
    const maxX = (el.offsetWidth * (s.scala - 1)) / 2
    const maxY = (el.offsetHeight * (s.scala - 1)) / 2
    s.x = limitaValore(s.x, -maxX, maxX)
    s.y = limitaValore(s.y, -maxY, maxY)
  }, [])

  /* Zoom di "fattore" mantenendo fermo il punto (clientX, clientY).
     Il palco è centrato nello schermo: il punto si misura dal centro. */
  const zoomVerso = useCallback(
    (fattore: number, clientX: number, clientY: number) => {
      const s = stato.current
      const nuovaScala = limitaValore(s.scala * fattore, 1, ZOOM_MASSIMO)
      const rapporto = nuovaScala / s.scala
      const px = clientX - window.innerWidth / 2
      const py = clientY - window.innerHeight / 2
      s.x = px - (px - s.x) * rapporto
      s.y = py - (py - s.y) * rapporto
      s.scala = nuovaScala
      limita()
      applica(false)
    },
    [applica, limita],
  )

  /* Sposta l'inquadratura (trascinamento con lo zoom attivo) */
  const sposta = useCallback(
    (dx: number, dy: number) => {
      stato.current.x += dx
      stato.current.y += dy
      limita()
      applica(false)
    },
    [applica, limita],
  )

  /* Torna a zoom 1, centrato, con una breve animazione */
  const azzera = useCallback(() => {
    stato.current = { scala: 1, x: 0, y: 0 }
    applica(true)
  }, [applica])

  const zoomato = useCallback(() => stato.current.scala > 1.01, [])

  const collegaZoom = useCallback((el: HTMLDivElement | null) => {
    elemento.current = el
  }, [])

  return { collegaZoom, zoomVerso, sposta, azzera, zoomato, hd }
}
