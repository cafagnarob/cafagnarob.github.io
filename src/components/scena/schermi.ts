/*
 * Schermi della stanza
 * - registraSchermi: salva le mesh degli schermi interattivi (chiamata
 *   da Stanza quando il modello è caricato), come registraVisteDaScena.
 * - schermoDi: nome glTF → schermo interattivo (o undefined).
 * - posaPerSchermo: dove mettere la camera perché lo schermo riempia la
 *   finestra del browser (vedi il calcolo spiegato sotto).
 * posaPerSchermo: analizza il piano dello schermo (utils/piano.ts)
 *  e mette la camera alla distanza in cui lo schermo copre la finestra.
 */
import * as THREE from "three"
import { SCHERMI, type NomeSchermo } from "../../config/schermi"
import type { VistaCamera } from "../../config/camera"
import { nomeGltf } from "../../utils/nomiGltf"
import { analizzaPiano } from "../../utils/piano"

type Punto = VistaCamera["posizione"]

const mesh = new Map<NomeSchermo, THREE.Mesh>()

const NOME_GLTF_A_SCHERMO = new Map(
  (Object.entries(SCHERMI) as [NomeSchermo, { nome: string }][]).map(
    ([schermo, { nome }]) => [nomeGltf(nome), schermo],
  ),
)

export function registraSchermi(scena: THREE.Object3D) {
  scena.traverse((oggetto) => {
    const schermo = NOME_GLTF_A_SCHERMO.get(oggetto.name)
    if (schermo && oggetto instanceof THREE.Mesh) mesh.set(schermo, oggetto)
  })
}

export const schermoDi = (nomeGltfOggetto: string) =>
  NOME_GLTF_A_SCHERMO.get(nomeGltfOggetto)
export const meshSchermo = (schermo: NomeSchermo) => mesh.get(schermo)

export function posaPerSchermo(
  schermo: NomeSchermo,
  m: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
): VistaCamera {
  const { centro, normale, larghezza, altezza, ...piano } = analizzaPiano(
    m,
    camera.position,
  )
  const alto = piano.alto.clone()
  if (SCHERMI[schermo].capovolgi) alto.negate()

  // Distanza "cover": lo schermo copre tutta la finestra
  const tangente = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const distanza = Math.min(altezza, larghezza / camera.aspect) / (2 * tangente)

  // Lo spostamento minuscolo verso il basso orienta la camera anche
  // quando guarda dritta in giù (telefono): senza, "l'alto" sarebbe casuale
  const posizione = centro
    .clone()
    .addScaledVector(normale, distanza)
    .addScaledVector(alto, -distanza * 0.001)

  return {
    posizione: posizione.toArray() as Punto,
    obiettivo: centro.toArray() as Punto,
  }
}
