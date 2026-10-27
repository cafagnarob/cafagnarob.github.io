/*
 * Materiali degli oggetti speciali della stanza (non bakeati).
 * Per ora sono PROVVISORI, semplici e leggeri: ognuno verrà sostituito
 * dalla sua funzione vera (pioggia sul vetro, foto cambiabile,
 * interfaccia del PC e del telefono).
 *
 * - MeshBasicMaterial non usa le luci della scena: mostra il colore
 *   così com'è. Va bene, perché nella stanza non ci sono luci reali.
 * - Il neon ha un colore "più luminoso del bianco" (valori > 1): dopo
 *   la tonemapping AgX appare come una luce accesa, satura al centro.
 *   La sua intensità viene animata con lo sfarfallio (vedi Stanza.tsx).
 */
import * as THREE from "three"
import { COLORE_BRACCIO, LUMINOSITA_VINILE } from "../../config/giradischi"
import { LUMINOSITA_SCHERMO_PC } from "../../config/schermoPc"

/* Colore del neon a piena intensità (lineare, oltre 1 = "luce") */
export const COLORE_NEON = new THREE.Color(6, 0.6, 0.45)

export function creaMaterialiSpeciali(texturecitta: THREE.Texture) {
  return {
    vetroFinestra: new THREE.MeshBasicMaterial({
      color: "#9fb4c8",
      transparent: true,
      opacity: 0.12,
      depthWrite: false, // il vetro non deve "nascondere" ciò che sta dietro
    }),
    vetroFoto: new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    }),
    foto: new THREE.MeshBasicMaterial({ color: "#2a2622" }),
    neon: new THREE.MeshBasicMaterial({ color: COLORE_NEON.clone() }),
    citta: new THREE.MeshBasicMaterial({ map: texturecitta }),
    schermo: new THREE.MeshBasicMaterial({ color: "#0d1424" }),
  }
}

/* Vinile: immagine propria (non bakeata, quella in Blender era quasi
   nera), scurita con LUMINOSITA_VINILE per stare nella penombra.
   MeshBasicMaterial non calcola luci: la "luce" è il colore che
   moltiplica l'immagine. Passa comunque dalla tonemapping AgX. */
export function creaMaterialeVinile(etichetta: THREE.Texture) {
  return new THREE.MeshBasicMaterial({
    map: etichetta,
    color: new THREE.Color().setScalar(LUMINOSITA_VINILE),
  })
}

/* Braccio del giradischi: colore uniforme con un leggero volume.
   MeshMatcapMaterial SENZA immagine usa una sfumatura interna (chiaro
   in alto, scuro in basso) moltiplicata per il colore: non servono
   luci (la scena non ne ha, la luce è nei bake). */
export function creaMaterialeBraccio() {
  return new THREE.MeshMatcapMaterial({ color: COLORE_BRACCIO })
}

/* Schermo del PC: lo sfondo come immagine "accesa".
   MeshBasicMaterial ignora le luci: il monitor mostra l'immagine con
   la sua luminosità, come uno schermo vero nella penombra.
   - colorSpace sRGB: la WebP è salvata in sRGB, la scheda video la
     riporta in luce lineare prima della tonemapping
   - flipY resta true (valore di useTexture): le UV di uvSulPiano hanno
     v = 1 in alto, come un'immagine normale */
export function creaMaterialeSchermoPc(sfondo: THREE.Texture) {
  sfondo.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshBasicMaterial({
    map: sfondo,
    color: new THREE.Color().setScalar(LUMINOSITA_SCHERMO_PC),
  })
}
