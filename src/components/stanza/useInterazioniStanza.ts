/*
 * useInterazioniStanza
 * Passaggio del mouse e clic sugli oggetti della stanza.
 * Restituisce:
 * - sottoMouse: la vista del gruppo sotto il mouse (ref, letta in useFrame
 *   per l'alone: cambia a ogni movimento, non deve provocare re-render)
 * - gestori: onPointerMove / onPointerOut / onClick da mettere sul modello
 *
 * Clic:
 *   panoramica   → oggetto cliccabile: vai alla sua vista
 *   in una vista → oggetto della vista: play/stop (giradischi) o
 *                  accensione dello schermo; altrove: esci
 *
 * - R3F chiama i gestori una volta per ogni oggetto attraversato dal
 *   raggio: si considera sempre il PIÙ VICINO (e.intersections[0]).
 * - Un trascinamento (ruotare la camera) non vale come clic.
 */
import { useRef } from "react"
import type { ThreeEvent } from "@react-three/fiber"
import type { NomeVista } from "../../config/camera"
import { SOGLIA_TRASCINAMENTO_PX } from "../../config/ispezione"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { accendiSchermo, esci, vaiA } from "../../store/azioniScena"
import { alternaDisco } from "../../store/azioniAudio"
import { vistaPerDispositivo } from "../scena/viste"
import { schermoDi } from "../scena/schermi"
import { VISTA_DI } from "./nomiStanza"

/* Vista dell'oggetto più vicino alla camera (o undefined): uguale in
   tutte le chiamate dello stesso evento */
function vistaColpita(evento: ThreeEvent<PointerEvent | MouseEvent>) {
  const primo = evento.intersections[0]?.object
  return primo ? VISTA_DI.get(primo.name) : undefined
}

export function useInterazioniStanza() {
  const dispatch = useAppDispatch()
  const vista = useAppSelector((s) => s.scena.vista)
  const sottoMouse = useRef<NomeVista | undefined>(undefined)

  const gestori = {
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      sottoMouse.current = vistaColpita(e)
      document.body.style.cursor =
        vista === "panoramica" && sottoMouse.current ? "pointer" : ""
    },

    onPointerOut: () => {
      sottoMouse.current = undefined
      document.body.style.cursor = ""
    },

    onClick: (e: ThreeEvent<MouseEvent>) => {
      // Trascinamento per ruotare la camera: non è un clic
      if (e.delta > SOGLIA_TRASCINAMENTO_PX) return
      // Agisce una sola volta, alla chiamata dell'oggetto più vicino
      if (e.intersections[0]?.object !== e.object) return

      const colpita = vistaColpita(e)

      // Panoramica: clic su un oggetto cliccabile → la sua vista
      if (vista === "panoramica") {
        if (!colpita) return
        e.stopPropagation()
        sottoMouse.current = undefined
        dispatch(vaiA(colpita))
        return
      }

      // In una vista: clic sull'oggetto stesso
      if (colpita && vistaPerDispositivo(colpita) === vista) {
        if (vista === "giradischi") {
          e.stopPropagation()
          dispatch(alternaDisco())
          return
        }
        if (schermoDi(e.object.name) === vista) {
          e.stopPropagation()
          dispatch(accendiSchermo(vista))
        }
        return
      }

      // Clic su qualsiasi altra cosa della stanza → esci
      e.stopPropagation()
      dispatch(esci())
    },
  }

  return { sottoMouse, gestori }
}
