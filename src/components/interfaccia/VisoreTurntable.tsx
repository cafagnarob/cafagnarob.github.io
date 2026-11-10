/*
 * VisoreTurntable
 * Render a 360° di CLO di un capo, sopra la stanza.
 *
 * - VOLO (useVoloTurntable): il render parte sopra il capo nell'armadio,
 *   nel fotogramma laterale, e vola al centro ruotando fino al fronte.
 *   Al ritorno fa il percorso inverso e poi chiama onChiuso.
 * - ZOOM (useZoom), solo a capo fermo al centro:
 *     rotella / pizzico sul trackpad → zoom verso il cursore
 *     pizzico con due dita (mobile) → zoom verso il centro delle dita
 *     tasti + − 0
 *   Oltre SOGLIA_HD si sovrappone la versione HD del fotogramma, che
 *   appare in dissolvenza appena caricata.
 * - UN DITO / MOUSE:
 *     a zoom 1 → trascinamento = rotazione
 *     con zoom → trascinamento = spostamento sul dettaglio
 *     click a zoom 1 → ritorno nell'armadio; click con zoom → azzera zoom
 * - I puntatori attivi stanno in una Map (id → posizione): con due il
 *   gesto diventa un pizzico e il click/rotazione in corso si annulla.
 * - La rotella usa un listener NATIVO non passivo, aggiunto con un
 *   callback ref (collegaVetrina): solo così preventDefault impedisce
 *   al browser di ingrandire tutta la pagina.
 */
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
import type { Turntable } from "../../data/lavoriModa"
import type { Rettangolo } from "../../utils/rettangoloSchermo"
import { urlFotogrammaHd, urlFotogrammi } from "../../utils/turntable"
import { modulo } from "../../utils/animazione"
import { useVoloTurntable } from "./useVoloTurntable"
import { useZoom } from "./useZoom"
import {
  PASSO_TASTIERA,
  PIXEL_PER_FOTOGRAMMA,
  SENSIBILITA_ROTELLA,
} from "../../config/vetrina"
import {
  OCCUPAZIONE_SCHERMO,
  SOGLIA_TRASCINAMENTO_PX,
} from "../../config/ispezione"
import stili from "./VisoreTurntable.module.css"

type VisoreTurntableProps = {
  titolo: string
  turntable: Turntable
  partenza: Rettangolo
  onRitorno: () => void // il render inizia a tornare (il cartellino sparisce)
  onChiuso: () => void
}

type Trascinamento = {
  inizioX: number
  ultimoX: number
  ultimoY: number
  fotogrammaIniziale: number
  spostamentoMassimo: number
}

type Punto = { x: number; y: number }

const distanza = (a: Punto, b: Punto) => Math.hypot(a.x - b.x, a.y - b.y)

export function VisoreTurntable({
  titolo,
  turntable,
  partenza,
  onChiuso,
}: VisoreTurntableProps) {
  const fotogrammi = urlFotogrammi(turntable)
  const [fotogramma, setFotogramma] = useState(turntable.fotogrammaArmadio)
  const [inUscita, setInUscita] = useState(false)

  const trascinamento = useRef<Trascinamento | null>(null)
  const puntatori = useRef(new Map<number, Punto>())
  const distanzaPizzico = useRef<number | null>(null)

  const { collegaPalco, avviaRitorno, fermo } = useVoloTurntable(
    partenza,
    turntable,
    setFotogramma,
  )
  const { collegaZoom, zoomVerso, sposta, azzera, zoomato, hd } = useZoom()

  /* Ritorno nell'armadio (ignorato se il capo è ancora in volo) */
  const chiudi = () => {
    if (avviaRitorno(fotogramma, onChiuso)) {
      setInUscita(true)
      onRitorno()
    }
  }

  /* Rotella: listener nativo non passivo (vedi commento in cima) */
  const collegaVetrina = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return
      const gestisciRotella = (evento: WheelEvent) => {
        evento.preventDefault()
        if (!fermo()) return
        zoomVerso(
          Math.exp(-evento.deltaY * SENSIBILITA_ROTELLA),
          evento.clientX,
          evento.clientY,
        )
      }
      el.addEventListener("wheel", gestisciRotella, { passive: false })
      return () => el.removeEventListener("wheel", gestisciRotella)
    },
    [fermo, zoomVerso],
  )

  const gestisciPressione = (evento: PointerEvent<HTMLDivElement>) => {
    if (!fermo()) return
    evento.currentTarget.setPointerCapture(evento.pointerId)
    puntatori.current.set(evento.pointerId, {
      x: evento.clientX,
      y: evento.clientY,
    })

    if (puntatori.current.size === 2) {
      // Secondo dito: inizia il pizzico, si annulla rotazione/click
      const [a, b] = [...puntatori.current.values()]
      distanzaPizzico.current = distanza(a, b)
      trascinamento.current = null
      return
    }

    trascinamento.current = {
      inizioX: evento.clientX,
      ultimoX: evento.clientX,
      ultimoY: evento.clientY,
      fotogrammaIniziale: fotogramma,
      spostamentoMassimo: 0,
    }
  }

  const gestisciMovimento = (evento: PointerEvent<HTMLDivElement>) => {
    if (!puntatori.current.has(evento.pointerId)) return
    puntatori.current.set(evento.pointerId, {
      x: evento.clientX,
      y: evento.clientY,
    })

    // Pizzico: zoom verso il punto medio tra le due dita
    if (puntatori.current.size === 2 && distanzaPizzico.current) {
      const [a, b] = [...puntatori.current.values()]
      const nuovaDistanza = distanza(a, b)
      zoomVerso(
        nuovaDistanza / distanzaPizzico.current,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
      )
      distanzaPizzico.current = nuovaDistanza
      return
    }

    const dati = trascinamento.current
    if (!dati) return
    const spostamentoTotale = evento.clientX - dati.inizioX
    dati.spostamentoMassimo = Math.max(
      dati.spostamentoMassimo,
      Math.abs(spostamentoTotale),
    )

    if (zoomato()) {
      // Con lo zoom: sposta l'inquadratura
      sposta(evento.clientX - dati.ultimoX, evento.clientY - dati.ultimoY)
    } else {
      // A zoom 1: ruota il capo
      const passi = Math.round(spostamentoTotale / PIXEL_PER_FOTOGRAMMA)
      setFotogramma(
        modulo(dati.fotogrammaIniziale - passi, turntable.fotogrammi),
      )
    }
    dati.ultimoX = evento.clientX
    dati.ultimoY = evento.clientY
  }

  /* Rilascio: un click vero azzera lo zoom, oppure chiude a zoom 1 */
  const gestisciRilascio = (evento: PointerEvent<HTMLDivElement>) => {
    puntatori.current.delete(evento.pointerId)
    if (puntatori.current.size < 2) distanzaPizzico.current = null

    const dati = trascinamento.current
    trascinamento.current = null
    if (!dati || dati.spostamentoMassimo > SOGLIA_TRASCINAMENTO_PX) return
    if (zoomato()) azzera()
    else chiudi()
  }

  const gestisciAnnullo = (evento: PointerEvent<HTMLDivElement>) => {
    puntatori.current.delete(evento.pointerId)
    distanzaPizzico.current = null
    trascinamento.current = null
  }

  const gestisciTasto = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === "Escape") {
      if (zoomato()) azzera()
      else chiudi()
      return
    }
    if (evento.key === "Enter") chiudi()
    if (!fermo()) return

    const centroX = window.innerWidth / 2
    const centroY = window.innerHeight / 2
    if (evento.key === "+" || evento.key === "=")
      zoomVerso(PASSO_TASTIERA, centroX, centroY)
    if (evento.key === "-") zoomVerso(1 / PASSO_TASTIERA, centroX, centroY)
    if (evento.key === "0") azzera()
    if (zoomato()) return // con lo zoom le frecce non ruotano
    if (evento.key === "ArrowLeft")
      setFotogramma((f) => modulo(f + 1, turntable.fotogrammi))
    if (evento.key === "ArrowRight")
      setFotogramma((f) => modulo(f - 1, turntable.fotogrammi))
  }

  const srcHd = urlFotogrammaHd(turntable, fotogramma)

  return (
    <div
      ref={collegaVetrina}
      className={stili.vetrina}
      style={{ "--occupazione": OCCUPAZIONE_SCHERMO } as CSSProperties}
      role="region"
      aria-label={`${titolo}: vista a 360 gradi`}
      tabIndex={0}
      autoFocus
      onPointerDown={gestisciPressione}
      onPointerMove={gestisciMovimento}
      onPointerUp={gestisciRilascio}
      onPointerCancel={gestisciAnnullo}
      onKeyDown={gestisciTasto}
    >
      <div className={`${stili.sfondo} ${inUscita ? stili.uscita : ""}`} />

      <div ref={collegaPalco} className={stili.palco}>
        <div ref={collegaZoom} className={stili.zoom}>
          <img
            src={fotogrammi[fotogramma]}
            alt={titolo}
            className={stili.immagine}
            draggable={false}
          />

          {/* Versione HD: appare in dissolvenza appena caricata */}
          {hd && (
            <img
              key={srcHd}
              src={srcHd}
              alt=""
              aria-hidden="true"
              className={stili.immagineHd}
              draggable={false}
              onLoad={(evento) =>
                evento.currentTarget.classList.add(stili.pronta)
              }
            />
          )}
        </div>
      </div>

      {!inUscita && (
        <p className={stili.suggerimento}>
          Trascina per ruotare · Pizzica o usa la rotella per lo zoom · Clicca
          per riporre
        </p>
      )}
    </div>
  )
}
