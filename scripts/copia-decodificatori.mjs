/*
 * Copia i decodificatori di three.js in public/ (eseguito da postinstall)
 * - basis: per le texture KTX2  → public/basis/
 * - draco: per i modelli Draco  → public/draco/
 * Devono essere della stessa versione di three.js installata: per questo
 * si ricopiano a ogni npm install invece di tenerli fissi.
 */
import { cpSync, mkdirSync } from "node:fs"

const DECODIFICATORI = [
  { da: "node_modules/three/examples/jsm/libs/basis", a: "public/basis" },
  { da: "node_modules/three/examples/jsm/libs/draco/gltf", a: "public/draco" },
]

for (const { da, a } of DECODIFICATORI) {
  mkdirSync(a, { recursive: true })
  cpSync(da, a, { recursive: true })
  console.log(`✔ ${da} → ${a}`)
}
