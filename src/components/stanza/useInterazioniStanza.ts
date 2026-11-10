/*
 * useInterazioniStanza
 * Passaggio del mouse e clic sugli oggetti della stanza.
 * Restituisce:
 * - sottoMouse: il bersaglio sotto il mouse, cioè la vista di un gruppo
 *   o "uscita" per l'insegna Exit (ref, letto in useFrame per l'alone:
 *   cambia a ogni movimento, non deve provocare re-render)
 * - gestori: onPointerMove / onPointerOut / onClick da mettere sul modello
 *
 * Clic:
 *   panoramica   → Exit: fuori dalla stanza (pagina iniziale);
 *                  oggetto cliccabile: vai alla sua vista
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
import { OGGETTO_USCITA } from "../../config/stanza"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  accendiSchermo,
  esci,
  esciDallaStanza,
  vaiA,
} from "../../store/azioniScena"
import { alternaDisco } from "../../store/azioniAudio"
import { nomeGltf } from "../../utils/nomiGltf"
import { vistaPerDispositivo } from "../scena/viste"
import { schermoDi } from "../scena/schermi"
import { VISTA_DI } from "./nomiStanza"

export type Bersaglio = NomeVista | "uscita"

const NOME_USCITA = nomeGltf(OGGETTO_USCITA)

/* Bersaglio dell'oggetto PIÙ VICINO alla camera: una vista, l'uscita
   (insegna Exit) o niente. Uguale in tutte le chiamate dello stesso evento. */
function bersaglioColpito(
  evento: ThreeEvent<PointerEvent | MouseEvent>,
): Bersaglio | undefined {
  const primo = evento.intersections[0]?.object
  if (!primo) return undefined
  if (primo.name === NOME_USCITA) return "uscita"
  return VISTA_DI.get(primo.name)
}

export function useInterazioniStanza() {
  const dispatch = useAppDispatch()
  const vista = useAppSelector((s) => s.scena.vista)
  const sottoMouse = useRef<Bersaglio | undefined>(undefined)

  const gestori = {
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      sottoMouse.current = bersaglioColpito(e)
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

      const colpito = bersaglioColpito(e)

      // Panoramica: Exit → fuori dalla stanza; oggetto cliccabile → la sua vista
      if (vista === "panoramica") {
        if (!colpito) return
        e.stopPropagation()
        sottoMouse.current = undefined
        document.body.style.cursor = ""
        dispatch(colpito === "uscita" ? esciDallaStanza() : vaiA(colpito))
        return
      }

      // In una vista: clic sull'oggetto stesso
      if (
        colpito &&
        colpito !== "uscita" &&
        vistaPerDispositivo(colpito) === vista
      ) {
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

      // Clic su qualsiasi altra cosa della stanza (anche l'Exit) → esci
      e.stopPropagation()
      dispatch(esci())
    },
  }

  return { sottoMouse, gestori }
}
