/*
 * Materiali della stanza
 * Percorre il modello e assegna a ogni oggetto il suo materiale:
 * - gruppi bakeati → materiale bakeato con il PNG base (e neon, se
 *   previsto) e il moltiplicatore della loro esposizione (2^-esposizione)
 * - oggetti speciali → materiali creati nel codice (materialiSpeciali.ts);
 *   il vinile riceve UV proiettate dall'alto per la sua immagine
 * - schermi → la loro immagine (sfondoSchermo.ts); senza immagine, o se
 *   manca l'empty della vista, il colore provvisorio
 *
 * Restituisce i materiali da animare a ogni fotogramma:
 * - insegna: il materiale del tubo al neon (sfarfallio)
 * - luceNeon: i materiali bakeati che ricevono la luce dell'insegna
 * - evidenziabili: per ogni vista, i materiali del gruppo che si
 *   illumina al passaggio del mouse
 */
import * as THREE from "three"
import {
  creaMaterialeBake,
  preparaTextureBake,
} from "../../materials/materialeBake"
import {
  creaMaterialeBraccio,
  creaMaterialeVinile,
  creaMaterialiSpeciali,
} from "./materialiSpeciali"
import { OGGETTI_BAKEATI } from "../../config/stanza"
import type { NomeVista } from "../../config/camera"
import type { ChiaveSchermo } from "../../config/sfondiSchermi"
import { proiettaUvDallAlto } from "../../utils/uvDallAlto"
import { NOMI, VISTA_DI } from "./nomiStanza"
import { chiaveNeon } from "./textureStanza"
import { registraLuminoso } from "../scena/oggettiLuminosi"
import { preparaPioggia } from "./pioggiaVetro"
import { applicaSfondoSchermo } from "./sfondoSchermo"

export type MaterialiAnimati = {
  insegna: THREE.MeshBasicMaterial
  luceNeon: THREE.ShaderMaterial[]
  evidenziabili: Map<NomeVista, THREE.ShaderMaterial[]>
  pioggia: THREE.ShaderMaterial | null
}

export function assegnaMaterialiStanza(
  scena: THREE.Object3D,
  texture: Record<string, THREE.Texture>,
  sfondi: Record<ChiaveSchermo, THREE.Texture>,
): MaterialiAnimati {
  Object.values(texture).forEach(preparaTextureBake)
  const speciali = creaMaterialiSpeciali(texture.citta)
  const luceNeon: THREE.ShaderMaterial[] = []
  const evidenziabili = new Map<NomeVista, THREE.ShaderMaterial[]>()

  scena.traverse((oggetto) => {
    if (!(oggetto instanceof THREE.Mesh)) return
    const nome = oggetto.name

    // Gruppi bakeati
    const opzioni = OGGETTI_BAKEATI[nome]
    if (opzioni) {
      const materiale = creaMaterialeBake(
        {
          base: texture[nome],
          neon: opzioni.neon ? texture[chiaveNeon(nome)] : undefined,
        },
        2 ** -opzioni.esposizione,
      )
      if (opzioni.doppiaFaccia) materiale.side = THREE.DoubleSide
      if (opzioni.neon) luceNeon.push(materiale)

      const vista = VISTA_DI.get(nome)
      if (vista) {
        const lista = evidenziabili.get(vista) ?? []
        lista.push(materiale)
        evidenziabili.set(vista, lista)
      }

      oggetto.material = materiale
      return
    }

    // Oggetti speciali
    if (nome === NOMI.vetroFinestra) oggetto.material = speciali.vetroFinestra
    else if (nome === NOMI.vetroFoto) oggetto.material = speciali.vetroFoto
    else if (nome === NOMI.foto) oggetto.material = speciali.foto
    else if (nome === NOMI.neon) {
      oggetto.material = speciali.neon
      registraLuminoso(oggetto)
    } else if (nome === NOMI.citta) oggetto.material = speciali.citta
    else if (NOMI.schermi.includes(nome)) {
      // Schermo con immagine; senza (o se manca l'empty) resta il provvisorio
      const chiave = NOMI.schermiConSfondo.get(nome)
      const fatto =
        chiave && applicaSfondoSchermo(oggetto, scena, chiave, sfondi[chiave])
      if (!fatto) oggetto.material = speciali.schermo
    } else if (nome === NOMI.braccio) oggetto.material = creaMaterialeBraccio()
    else if (nome === NOMI.vinile) {
      proiettaUvDallAlto(oggetto.geometry)
      oggetto.material = creaMaterialeVinile(texture.etichettaVinile)
    }
  })

  // Vetro della finestra: pioggia (sostituisce il materiale semplice)
  const pioggia = preparaPioggia(scena, texture.citta)

  return { insegna: speciali.neon, luceNeon, evidenziabili, pioggia }
}
