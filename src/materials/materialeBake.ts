/*
 * Materiale bakeato
 *
 * Crea un materiale (ShaderMaterial) che ricostruisce la luce di
 * Blender sommando i passaggi bakeati:
 *   colore = base × 2 + led × 4 × intensitaLed + neon × 2 × intensitaNeon
 * e poi applica la tonemapping del renderer (AgX, come in Blender)
 * e la conversione nello spazio colore dello schermo.
 *
 * - Le texture vengono lette in luce lineare (la scheda video
 *   decodifica l'sRGB dei PNG), quindi le somme sono corrette.
 * - Se un oggetto non ha un passaggio (es. niente neon), al suo posto
 *   si usa una texture nera 1×1: aggiungere nero = non aggiungere nulla.
 * - intensitaLed e intensitaNeon sono le "manopole" che animeremo
 *   (LED che si accende all'apertura, neon che sfarfalla).
 *
 *  * - evidenziazione (0–1): schiarisce leggermente l'oggetto e aggiunge
 *   un alone di colore coloreAlone sui bordi della sagoma (effetto
 *   Fresnel: più la superficie è di taglio rispetto alla camera, più
 *   luce riceve). Serve a indicare gli oggetti cliccabili.
 */
import * as THREE from "three"
import { MOLTIPLICATORI } from "../config/luci"
import { COLORE_ALONE } from "../config/armadio"

/* --- Vertex shader: passa UV, normale e direzione della vista --- */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormale;  // normale della superficie (spazio camera)
  varying vec3 vVista;    // dalla superficie verso la camera (spazio camera)

  void main() {
    vUv = uv;
    vec4 posizioneVista = modelViewMatrix * vec4(position, 1.0);
    vNormale = normalize(normalMatrix * normal);
    vVista = -posizioneVista.xyz;
    gl_Position = projectionMatrix * posizioneVista;
  }
`

/* --- Fragment shader: somma i passaggi, evidenzia e applica AgX --- */
const fragmentShader = /* glsl */ `
  // Texture bakeate
  uniform sampler2D mappaBase;
  uniform sampler2D mappaLed;
  uniform sampler2D mappaNeon;

  // Valori animati da JavaScript
  uniform float intensitaLed;
  uniform float intensitaNeon;
  uniform float evidenziazione; // 0 = normale, 1 = evidenziato

  // Costanti
  uniform vec3 moltiplicatori;  // riconversione esposizione: x = base, y = led, z = neon
  uniform vec3 coloreAlone;     // colore della luce sui bordi

  // Dal vertex shader
  varying vec2 vUv;
  varying vec3 vNormale;
  varying vec3 vVista;

  void main() {
    vec3 base = texture2D(mappaBase, vUv).rgb * moltiplicatori.x;
    vec3 led  = texture2D(mappaLed,  vUv).rgb * moltiplicatori.y * intensitaLed;
    vec3 neon = texture2D(mappaNeon, vUv).rgb * moltiplicatori.z * intensitaNeon;
    vec3 colore = base + led + neon;

    // Evidenziazione: schiarisce leggermente l'oggetto...
    colore *= 1.0 + evidenziazione * 0.35;

    // ...e aggiunge un ALONE sui bordi della sagoma (effetto Fresnel):
    // 0 dove la superficie guarda la camera, 1 dove è di taglio
    float fronte = max(dot(normalize(vNormale), normalize(vVista)), 0.0);
    float fresnel = pow(1.0 - fronte, 3.0);
    colore += coloreAlone * fresnel * evidenziazione * 0.6;

    gl_FragColor = vec4(colore, 1.0);

    // Pezzi di shader di three.js: applicano la tonemapping
    // impostata sul renderer (AgX) e la conversione per lo schermo
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

/* --- Texture nera 1×1 per i passaggi mancanti --- */
const TEXTURE_NERA = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
TEXTURE_NERA.needsUpdate = true

export type TextureBake = {
  base: THREE.Texture
  led?: THREE.Texture
  neon?: THREE.Texture
}

/* --- Imposta una texture bakeata come la vuole il formato glTF --- */
export function preparaTextureBake(texture: THREE.Texture): THREE.Texture {
  texture.flipY = false // UV glTF: origine in alto
  texture.colorSpace = THREE.SRGBColorSpace // PNG salvati in sRGB
  texture.needsUpdate = true
  return texture
}

/* --- Crea il materiale per un oggetto ---
 * moltiplicatoreBase: per gli oggetti salvati con un'esposizione diversa
 * da quella standard (es. -2 → ×4). Se manca, si usa MOLTIPLICATORI.base. */
export function creaMaterialeBake(
  texture: TextureBake,
  moltiplicatoreBase: number = MOLTIPLICATORI.base,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      mappaBase: { value: texture.base },
      mappaLed: { value: texture.led ?? TEXTURE_NERA },
      mappaNeon: { value: texture.neon ?? TEXTURE_NERA },
      coloreAlone: { value: new THREE.Vector3(...COLORE_ALONE) },
      intensitaLed: { value: 1 },
      intensitaNeon: { value: 1 },
      evidenziazione: { value: 0 },
      moltiplicatori: {
        value: new THREE.Vector3(
          moltiplicatoreBase,
          MOLTIPLICATORI.led,
          MOLTIPLICATORI.neon,
        ),
      },
    },
    vertexShader,
    fragmentShader,
  })
}
