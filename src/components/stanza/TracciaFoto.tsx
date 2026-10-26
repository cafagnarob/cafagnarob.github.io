/*
 * TracciaFoto
 * Nella vista del profilo, a ogni fotogramma calcola dove si trova la
 * foto del comodino sullo schermo (rettangolo delle mesh foto e vetro)
 * e lo scrive in variabili CSS sulla pagina:
 *   --foto-cx, --foto-cy  centro (px)
 *   --foto-rx, --foto-ry  semiassi dell'ellisse nitida (px)
 * Le legge la maschera dello sfondo del modale (ModaleProfilo.module.css).
 *
 * - Segue la foto anche durante il movimento della camera.
 * - Aggiorna solo se i valori cambiano: lo sfondo sfocato si ridisegna
 *   a ogni modifica della maschera, quindi meno modifiche = più fluido.
 * - Semiassi = metà lato × 1.5: un'ellisse così contiene tutto il
 *   rettangolo, angoli compresi, anche con il bordo sfumato.
 * - Non disegna nulla (restituisce null): lavora solo in useFrame.
 */
import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA } from "../../config/stanza"

import { MARGINE_FOTO_PX, VISTA_PROFILO } from "../../config/profilo"
import { store } from "../../store/store"
import { rettangoloSchermo } from "../../utils/rettangoloSchermo"
import { NOMI } from "./nomiStanza"
import { PERCORSO_DRACO } from "../../config/texture"
import { registraPuntoFoto } from "./puntoFoto"

export function TracciaFoto() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)
  const canvas = useThree((stato) => stato.gl.domElement)
  const ultimo = useRef("")

  const oggetti = useMemo(() => {
    const trovati = [NOMI.foto, NOMI.vetroFoto]
      .map((nome) => scene.getObjectByName(nome))
      .filter((oggetto) => oggetto !== undefined)
    if (trovati.length > 0) {
      const riquadro = new THREE.Box3()
      for (const oggetto of trovati) riquadro.expandByObject(oggetto)
      registraPuntoFoto(riquadro.getCenter(new THREE.Vector3()))
    }
    return trovati
  }, [scene])

  useFrame(({ camera }) => {
    if (oggetti.length === 0 || store.getState().scena.vista !== VISTA_PROFILO)
      return

    const { x, y, larghezza, altezza } = rettangoloSchermo(
      oggetti,
      camera,
      canvas,
    )
    // Bordi del rettangolo nitido, con il margine per la cornice
    const sinistra = Math.round(x - MARGINE_FOTO_PX)
    const destra = Math.round(x + larghezza + MARGINE_FOTO_PX)
    const alto = Math.round(y - MARGINE_FOTO_PX)
    const basso = Math.round(y + altezza + MARGINE_FOTO_PX)

    const valori = `${sinistra},${destra},${alto},${basso}`
    if (valori === ultimo.current) return
    ultimo.current = valori

    const stile = document.documentElement.style
    stile.setProperty("--foto-sinistra", `${sinistra}px`)
    stile.setProperty("--foto-destra", `${destra}px`)
    stile.setProperty("--foto-alto", `${alto}px`)
    stile.setProperty("--foto-basso", `${basso}px`)
  })

  return null
}
