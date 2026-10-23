/*
 * Nomi glTF
 * three.js "pulisce" i nomi degli oggetti glTF: gli spazi diventano "_"
 * e i punti vengono tolti ("neon insegna" → "neon_insegna",
 * "screen.001" → "screen001"). Questa funzione converte un nome scritto
 * come in Blender nello stesso modo, così i confronti coincidono.
 */
import * as THREE from "three"

export const nomeGltf = (nomeBlender: string) =>
  THREE.PropertyBinding.sanitizeNodeName(nomeBlender)
