/*
 * FotoProfilo
 * Mette la foto del profilo nel portafoto sul comodino:
 *   1. analizza il piano della mesh "foto" (dal punto di vista del letto)
 *   2. genera le UV con ritaglio "cover" (utils/uvSulPiano)
 *   3. assegna un materiale con la foto, moltiplicata per COLORE_FOTO
 *      (la luce calda della stanza: non sembra un adesivo luminoso)
 * MeshBasicMaterial: niente luci di three.js (la stanza non ne ha), la
 * "luce" è il colore che moltiplica l'immagine.
 * Non disegna nulla: assegna il materiale una volta, nello useMemo.
 */
import { useMemo } from "react"
import * as THREE from "three"
import { useGLTF, useTexture } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA } from "../../config/stanza"

import { ASPETTO_FOTO, COLORE_FOTO, PERCORSO_FOTO } from "../../config/profilo"
import { analizzaPiano } from "../../utils/piano"
import { uvSulPiano } from "../../utils/uvSulPiano"
import { vistaPer } from "../scena/viste"
import { NOMI } from "./nomiStanza"
import { PERCORSO_DRACO } from "../../config/texture"
import { registraMeshFoto } from "./puntoFoto"

export function FotoProfilo() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)
  const foto = useTexture(PERCORSO_FOTO)

  useMemo(() => {
    const mesh = scene.getObjectByName(NOMI.foto)
    const vista = vistaPer("letto") ?? vistaPer("panoramica")
    if (!(mesh instanceof THREE.Mesh) || !vista) {
      console.warn("Foto del profilo: mesh 'foto' non trovata")
      return
    }

    foto.colorSpace = THREE.SRGBColorSpace
    const piano = analizzaPiano(mesh, new THREE.Vector3(...vista.posizione))
    uvSulPiano(mesh, piano, ASPETTO_FOTO)
    mesh.material = new THREE.MeshBasicMaterial({
      map: foto,
      color: new THREE.Color(...COLORE_FOTO),
    })
    registraMeshFoto(mesh)
  }, [scene, foto])

  return null
}

useTexture.preload(PERCORSO_FOTO)
