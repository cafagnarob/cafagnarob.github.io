/*
 * Materiale dello sfondo animato
 * Un quad a tutto schermo: il vertex shader ignora la camera e mette
 * i vertici del piano 2×2 direttamente negli angoli dello schermo.
 * Il fragment shader, per ogni pixel:
 * 1. trova la riga (righe = quante ne stanno nell'altezza) e la
 *    posizione verticale dentro la riga (0–1)
 * 2. misura la x "in parole" (quante parole stanno in larghezza dipende
 *   dalle proporzioni dello schermo e da quelle della parola)
 * 3. fa scorrere le righe pari verso destra e le dispari verso sinistra,
 *    e sfasa ogni riga di mezza parola (come nella reference)
 * 4. legge la trasparenza della maschera e mescola fondo e scritta
 * La maschera ha RepeatWrapping in orizzontale: la parola si ripete da
 * sola. Senza mipmap: con le righe, la UV salta tra un pixel e l'altro
 * e le mipmap disegnerebbero righe sottili sui bordi delle parole.
 * Poi tonemapping e spazio colore del renderer, come il materiale bake.
 */
import * as THREE from "three"

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Piano 2×2 → già in coordinate dello schermo (da −1 a 1):
    // nessuna camera, sempre a tutto schermo
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D maschera;
  uniform float tempo;              // parole già scorse
  uniform float aspettoSchermo;     // larghezza / altezza
  uniform float aspettoParola;      // larghezza / altezza della parola
  uniform float righe;              // righe nell'altezza dello schermo
  uniform vec3 coloreFondo;
  uniform vec3 coloreScritta;

  varying vec2 vUv;

  void main() {
    // 1. Riga del pixel e posizione verticale dentro la riga
    float rigaContinua = vUv.y * righe;
    float riga = floor(rigaContinua);
    float v = fract(rigaContinua);

    // 2. x misurata in parole
    float x = vUv.x * aspettoSchermo * righe / aspettoParola;

    // 3. Righe alternate in direzioni opposte, sfasate di mezza parola
    float verso = mod(riga, 2.0) < 1.0 ? 1.0 : -1.0;
    x += verso * tempo + riga * 0.5;

    // 4. Forma della parola → colore
    float forma = texture2D(maschera, vec2(x, v)).a;
    gl_FragColor = vec4(mix(coloreFondo, coloreScritta, forma), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function creaMaterialeSfondo(maschera: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      maschera: { value: maschera },
      tempo: { value: 0 },
      aspettoSchermo: { value: 1 },
      aspettoParola: { value: 1 },
      righe: { value: 2 },
      coloreFondo: { value: new THREE.Color() },
      coloreScritta: { value: new THREE.Color() },
    },
    vertexShader,
    fragmentShader,
    depthTest: false, // sempre dietro a tutto: lo decide l'ordine di disegno
    depthWrite: false,
  })
}
