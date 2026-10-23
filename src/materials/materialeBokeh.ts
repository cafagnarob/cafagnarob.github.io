/*
 * Materiale bokeh
 * Disco luminoso sfocato, come una luce fuori fuoco in fotografia:
 * pieno al centro, bordo morbido, con un anello appena più chiaro
 * (tipico del bokeh degli obiettivi).
 *
 * - Pensato per InstancedMesh: colore e intensità di ogni luce
 *   arrivano da instanceColor (impostato con setColorAt; 0 = spenta).
 * - Fusione ADDITIVA: le luci si sommano a ciò che c'è dietro, come
 *   la luce vera. depthWrite false: non nascondono nulla.
 * - Passa dalla tonemapping AgX come il resto della scena.
 */
import * as THREE from "three"

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColore;

  void main() {
    vUv = uv;
    vColore = instanceColor;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColore;

  void main() {
    float d = length(vUv - 0.5) * 2.0;           // 0 al centro, 1 sul bordo
    float disco = smoothstep(1.0, 0.65, d);      // bordo morbido
    float anello = 0.85 + 0.15 * smoothstep(0.4, 0.9, d);
    gl_FragColor = vec4(vColore * disco * anello, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function creaMaterialeBokeh() {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
