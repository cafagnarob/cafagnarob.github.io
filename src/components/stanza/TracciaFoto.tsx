/*
 * TracciaFoto
 * Nella vista del profilo, a ogni fotogramma calcola dove si trova la
 * foto del comodino sullo schermo (rettangolo delle mesh foto e vetro)
 * e lo registra (registraRettangoloFoto): è il punto di partenza del
 * volo della foto in primo piano (FotoInPrimoPiano).
 * Al caricamento registra anche il centro della foto nel mondo
 * (registraPuntoFoto), usato dalla regia della camera.
 * Non disegna nulla: lavora solo in useMemo e useFrame.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA } from "../../config/stanza"

import { VISTA_PROFILO } from "../../config/profilo"
import { store } from "../../store/store"
import { rettangoloSchermo } from "../../utils/rettangoloSchermo"
import { registraPuntoFoto, registraRettangoloFoto } from "./puntoFoto"
import { NOMI } from "./nomiStanza"
import { PERCORSO_DRACO } from "../../config/texture"

export function TracciaFoto() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)
  const canvas = useThree((stato) => stato.gl.domElement)

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
    registraRettangoloFoto(rettangoloSchermo(oggetti, camera, canvas))
  })

  return null
}
