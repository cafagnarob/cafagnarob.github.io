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
 */
import * as THREE from "three"
import { MOLTIPLICATORI } from "../config/luci"

/* --- Vertex shader: passa le coordinate UV al fragment shader --- */
const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/* --- Fragment shader: somma i passaggi e applica AgX --- */
const fragmentShader = /* glsl */ `
  uniform sampler2D mappaBase;
  uniform sampler2D mappaLed;
  uniform sampler2D mappaNeon;
  uniform float intensitaLed;
  uniform float intensitaNeon;
  uniform vec3 moltiplicatori; // x = base, y = led, z = neon

  varying vec2 vUv;

  void main() {
    vec3 base = texture2D(mappaBase, vUv).rgb * moltiplicatori.x;
    vec3 led  = texture2D(mappaLed,  vUv).rgb * moltiplicatori.y * intensitaLed;
    vec3 neon = texture2D(mappaNeon, vUv).rgb * moltiplicatori.z * intensitaNeon;

    gl_FragColor = vec4(base + led + neon, 1.0);

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

/* --- Crea il materiale per un oggetto --- */
export function creaMaterialeBake(texture: TextureBake): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      mappaBase: { value: texture.base },
      mappaLed: { value: texture.led ?? TEXTURE_NERA },
      mappaNeon: { value: texture.neon ?? TEXTURE_NERA },
      intensitaLed: { value: 1 },
      intensitaNeon: { value: 1 },
      moltiplicatori: {
        value: new THREE.Vector3(
          MOLTIPLICATORI.base,
          MOLTIPLICATORI.led,
          MOLTIPLICATORI.neon,
        ),
      },
    },
    vertexShader,
    fragmentShader,
  })
}
