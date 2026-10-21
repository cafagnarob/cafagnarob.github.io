/*
 * Configurazione dell'armadio
 *
 * Per ogni oggetto del file armadio.glb indica quali passaggi di
 * bake esistono. I PNG seguono la convenzione di nomi dello script
 * di Blender: <oggetto>_<passaggio>.png (es. anta_sx_led.png).
 * I nomi devono corrispondere esattamente ai nomi degli oggetti
 * in Blender, che il formato glTF conserva.
 */
import type { Passaggio } from "./luci"

export const CARTELLA_TEXTURE_ARMADIO = "/textures/armadio"

export const PASSAGGI_ARMADIO: Record<string, Passaggio[]> = {
  armadio_corpo: ["base", "led", "neon"],
  anta_sx: ["base", "led"],
  anta_dx: ["base", "led"],
  capo_1: ["base", "led"],
  capo_2: ["base", "led"],
  capo_3: ["base", "led"],
  capo_4: ["base", "led"],
  capo_5: ["base", "led"],
  capo_6: ["base", "led"],
  capo_7: ["base", "led"],
  capo_7_minuteria: ["base", "led"],
  grucce: ["base", "led"],
}
