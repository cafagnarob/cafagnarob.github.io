/*
 * Vetro con la pioggia
 * Shader del vetro della finestra: condensa leggera + tre strati di gocce
 * (ferme grandi, ferme piccole, che scivolano con la loro scia).
 *
 * - Le gocce sono calcolate sul piano del vetro in metri (vetroCentro,
 *   vetroDestra, vetroAlto × scalaGocce): stessa misura su tutti i riquadri.
 * - Ogni goccia è una LENTE: per ogni pixel si segue il raggio dalla
 *   camera fino al piano della città e si legge l'immagine lì; dentro la
 *   goccia la lettura è spostata al contrario (città capovolta e
 *   deformata, come in una goccia vera). cittaUv converte le coordinate
 *   del piano nelle UV dell'immagine (utils/mappaturaUv.ts).
 * - Bordo scuro e piccolo riflesso chiaro danno volume alla goccia.
 * - Le scie delle gocce che scivolano "puliscono" la condensa.
 * - Trasparente, senza scrittura di profondità, come un vetro.
 */
import * as THREE from "three"
import type { Piano } from "../utils/piano"
import {
  FORZA_RIFRAZIONE,
  GOCCE_PER_METRO,
  LUMINOSITA_GOCCE,
  OPACITA_NEBBIA,
  TINTA_VETRO,
} from "../config/pioggia"

const vertexShader = /* glsl */ `
  varying vec3 vMondo;

  void main() {
    vec4 mondo = modelMatrix * vec4(position, 1.0);
    vMondo = mondo.xyz;
    gl_Position = projectionMatrix * viewMatrix * mondo;
  }
`

const fragmentShader = /* glsl */ `
  uniform float tempo;
  uniform sampler2D mappaCitta;
  uniform vec3 cittaCentro;
  uniform vec3 cittaNormale;
  uniform vec3 cittaDestra;
  uniform vec3 cittaAlto;
  uniform vec2 cittaDimensioni;
  uniform mat3 cittaUv;
  uniform vec3 vetroCentro;
  uniform vec3 vetroDestra;
  uniform vec3 vetroAlto;
  uniform float scalaGocce;
  uniform float forzaRifrazione;
  uniform float luminositaGocce;
  uniform float opacitaNebbia;
  uniform vec3 tinta;
  varying vec3 vMondo;

  float casuale(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Gocce ferme: al massimo una per cella; compare, resta, svanisce.
  // Restituisce xy = posizione nella goccia (-1..1, per la lente), z = maschera.
  vec3 goccieFerme(vec2 p, float t, float seme) {
    vec2 cella = floor(p);
    vec2 f = fract(p) - 0.5;
    float r1 = casuale(cella + seme);
    float r2 = casuale(cella + seme + 17.0);
    float r3 = casuale(cella + seme + 31.0);
    vec2 centro = (vec2(r1, r2) - 0.5) * 0.6;
    float raggio = mix(0.08, 0.2, r3);
    float vita = fract(t * mix(0.04, 0.12, r1) + r2);
    float presenza = smoothstep(0.0, 0.05, vita) * smoothstep(1.0, 0.7, vita)
                   * step(0.35, r3); // non tutte le celle hanno una goccia
    vec2 d = (f - centro) / raggio;
    float m = smoothstep(1.0, 0.8, length(d)) * presenza;
    return vec3(d, m);
  }

  // Gocce che scivolano: una per colonna, scendono a scatti.
  // Restituisce xy = posizione nella goccia, z = maschera, w = scia.
  vec4 goccieCadenti(vec2 p, float t) {
    const float CICLO = 8.0; // celle percorse prima di ripartire dall'alto
    float colonna = floor(p.x);
    float r = casuale(vec2(colonna, 5.3));
    float tt = t * mix(0.6, 1.4, r) + r * 50.0;
    float discesa = tt + 0.3 * sin(tt * 2.3);      // rallenta e riparte
    float yGoccia = mod(-discesa + r * CICLO, CICLO);
    float yLocale = mod(p.y, CICLO);
    float xLocale = fract(p.x) - 0.5 - (r - 0.5) * 0.4;
    vec2 d = vec2(xLocale / 0.16, (yLocale - yGoccia) / 0.22);
    float m = smoothstep(1.0, 0.8, length(d));
    float sopra = yLocale - yGoccia;
    float scia = smoothstep(0.05, 0.0, abs(xLocale)) * step(0.0, sopra)
               * smoothstep(3.0, 0.2, sopra);
    return vec4(d, m, scia);
  }

  void main() {
    // Coordinate sul vetro, in celle
    vec3 dalCentro = vMondo - vetroCentro;
    vec2 p = vec2(dot(dalCentro, vetroDestra), dot(dalCentro, vetroAlto)) * scalaGocce;

    vec3 ferme1 = goccieFerme(p, tempo, 0.0);
    vec3 ferme2 = goccieFerme(p * 1.7 + 3.1, tempo, 11.0);
    vec4 cadenti = goccieCadenti(p * vec2(0.5, 1.0), tempo); // colonne più larghe

    // In ogni pixel vince la goccia più evidente
    vec2 d = ferme1.xy;
    float m = ferme1.z;
    if (ferme2.z > m) { d = ferme2.xy; m = ferme2.z; }
    if (cadenti.z > m) { d = cadenti.xy; m = cadenti.z; }

    // Punto della città dietro questo pixel: raggio camera → piano della città
    vec3 raggio = normalize(vMondo - cameraPosition);
    float distanza = dot(cittaCentro - vMondo, cittaNormale) / dot(raggio, cittaNormale);
    vec3 punto = vMondo + raggio * distanza - cittaCentro;
    vec2 st = vec2(dot(punto, cittaDestra) / cittaDimensioni.x,
                   dot(punto, cittaAlto) / cittaDimensioni.y) + 0.5;

    // Lente: dentro la goccia la città è spostata al contrario
    st -= d * forzaRifrazione;
    vec2 uv = (cittaUv * vec3(st, 1.0)).xy;
    vec3 citta = texture2D(mappaCitta, uv).rgb * luminositaGocce;

    // Volume della goccia: bordo più scuro, riflesso in alto a sinistra
    float bordo = smoothstep(0.55, 1.0, length(d));
    float riflesso = smoothstep(0.3, 0.0, length(d - vec2(-0.35, 0.4)));
    vec3 goccia = citta * (1.0 - bordo * 0.6) + riflesso * 0.5;

    // Condensa, più sottile lungo le scie
    float nebbia = opacitaNebbia * (1.0 - cadenti.w);
    gl_FragColor = mix(vec4(tinta, nebbia), vec4(goccia, 1.0), m * 0.95);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function creaMaterialeVetroPioggia(
  texturaCitta: THREE.Texture,
  pianoCitta: Piano,
  uvCitta: THREE.Matrix3,
  pianoVetro: Piano,
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      tempo: { value: 0 },
      mappaCitta: { value: texturaCitta },
      cittaCentro: { value: pianoCitta.centro },
      cittaNormale: { value: pianoCitta.normale },
      cittaDestra: { value: pianoCitta.destra },
      cittaAlto: { value: pianoCitta.alto },
      cittaDimensioni: {
        value: new THREE.Vector2(pianoCitta.larghezza, pianoCitta.altezza),
      },
      cittaUv: { value: uvCitta },
      vetroCentro: { value: pianoVetro.centro },
      vetroDestra: { value: pianoVetro.destra },
      vetroAlto: { value: pianoVetro.alto },
      scalaGocce: { value: GOCCE_PER_METRO },
      forzaRifrazione: { value: FORZA_RIFRAZIONE },
      luminositaGocce: { value: LUMINOSITA_GOCCE },
      opacitaNebbia: { value: OPACITA_NEBBIA },
      tinta: { value: new THREE.Color(...TINTA_VETRO) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  })
}
