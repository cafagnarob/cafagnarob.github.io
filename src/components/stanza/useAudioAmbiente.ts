/*
 * useAudioAmbiente
 * A ogni fotogramma misura la distanza tra la camera e il centro del
 * vetro della finestra e la trasforma in "vicinanza" (0–1):
 *   0 = distanza della panoramica, 1 = distanza della vista pc (o meno).
 * Le due distanze di riferimento si ricavano dalle viste registrate:
 * spostando gli empty in Blender, l'audio si adatta da solo.
 * Va chiamato DOPO la registrazione delle viste (useMemo di Stanza).
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { nomeGltf } from "../../utils/nomiGltf"
import { OGGETTI_SPECIALI } from "../../config/stanza"
import { vistaPer } from "../scena/viste"
import { impostaVicinanza } from "../../audio/ambiente"

export function useAudioAmbiente(scena: THREE.Object3D) {
  const riferimenti = useMemo(() => {
    const vetro = scena.getObjectByName(
      nomeGltf(OGGETTI_SPECIALI.vetroFinestra),
    )
    const lontana = vistaPer("panoramica")
    const vicina = vistaPer("pc")
    if (!vetro || !lontana || !vicina) {
      console.warn("Audio ambiente: vetro o viste non trovati")
      return null
    }
    const centro = new THREE.Box3()
      .setFromObject(vetro)
      .getCenter(new THREE.Vector3())
    return {
      centro,
      distanzaLontana: centro.distanceTo(
        new THREE.Vector3(...lontana.posizione),
      ),
      distanzaVicina: centro.distanceTo(new THREE.Vector3(...vicina.posizione)),
    }
  }, [scena])

  useFrame(({ camera }) => {
    if (!riferimenti) return
    const { centro, distanzaLontana, distanzaVicina } = riferimenti
    const distanza = camera.position.distanceTo(centro)
    const vicinanza =
      (distanzaLontana - distanza) / (distanzaLontana - distanzaVicina)
    impostaVicinanza(THREE.MathUtils.clamp(vicinanza, 0, 1))
  })
}
