/*
 * Materiale del fumo
 * Shader che disegna una colonna di fumo su un rettangolo (UV 0–1,
 * v = 0 alla base). Nessuna texture: tutto è calcolato con il rumore.
 *
 * - rumore / fbm: rumore morbido sommato su 4 scale (fractal Brownian
 *   motion), l'aspetto "a sbuffi" del fumo. Scorre verso l'alto con il
 *   tempo: il fumo sale.
 * - Forma: colonna stretta alla base che si allarga e ondeggia salendo
 *   (lo spostamento laterale cresce con l'altezza).
 * - Filamenti: un secondo rumore, più fine, scava la colonna.
 * - Dissolvenza: nasce sfumando sopra la tazza e sparisce verso l'alto.
 * - Trasparente, senza scrittura di profondità: non nasconde ciò che c'è dietro.
 */
import * as THREE from "three"
import { COLORE_FUMO, OPACITA_FUMO } from "../config/fumo"

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float tempo;
  uniform vec3 colore;
  uniform float opacita;
  varying vec2 vUv;

  // Numero pseudo-casuale per ogni punto della griglia
  float casuale(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Rumore morbido: interpola i valori casuali dei 4 angoli della cella
  float rumore(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(casuale(i), casuale(i + vec2(1.0, 0.0)), u.x),
      mix(casuale(i + vec2(0.0, 1.0)), casuale(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // fbm: 4 strati di rumore, ognuno più fine e più debole del precedente
  float fbm(vec2 p) {
    float somma = 0.0;
    float ampiezza = 0.5;
    for (int i = 0; i < 4; i++) {
      somma += rumore(p) * ampiezza;
      p *= 2.0;
      ampiezza *= 0.5;
    }
    return somma;
  }

  void main() {
    float y = vUv.y;

    // Ondeggiamento: spostamento laterale che cresce salendo
    float onda = fbm(vec2(y * 2.5 - tempo * 0.3, tempo * 0.1)) - 0.5;
    float x = vUv.x - 0.5 - onda * 0.6 * y;

    // Colonna: stretta alla base, larga in alto
    float larghezza = mix(0.05, 0.3, y);
    float colonna = smoothstep(larghezza, 0.0, abs(x));

    // Filamenti che salgono
    float fili = fbm(vec2(x * 7.0, y * 4.0 - tempo * 0.6));
    float densita = colonna * smoothstep(0.3, 0.75, fili);

    // Nasce sopra la tazza, si dissolve in alto
    densita *= smoothstep(0.0, 0.12, y) * smoothstep(1.0, 0.4, y);

    gl_FragColor = vec4(colore, densita * opacita);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function creaMaterialeFumo() {
  return new THREE.ShaderMaterial({
    uniforms: {
      tempo: { value: 0 },
      colore: { value: new THREE.Color(...COLORE_FUMO) },
      opacita: { value: OPACITA_FUMO },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
}
