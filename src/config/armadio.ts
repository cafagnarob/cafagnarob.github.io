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

/*
 * Ante dell'armadio
 * direzione: verso di apertura (+1 / -1), ricavato da Blender:
 *   anta_sx si apriva verso angoli negativi, anta_dx verso positivi.
 * ANGOLO_APERTURA: di quanto si aprono (gradi). "Leggermente aperte"
 *   come da progetto: abbastanza da vedere dentro, non spalancate.
 * Velocità: più alto = più veloce (vedi formula di smorzamento).
 */
export const ANTE_ARMADIO: Record<string, { direzione: 1 | -1 }> = {
  anta_sx: { direzione: -1 },
  anta_dx: { direzione: 1 },
}

export const ANGOLO_APERTURA_GRADI = 115
export const VELOCITA_ANTE = 3
export const VELOCITA_LED = 2

/*
 * Capi cliccabili
 * Collega ogni oggetto 3D al lavoro (scheda) che apre.
 * Più oggetti possono aprire lo stesso lavoro: lo zaino e le sue
 * minuterie sono due oggetti in 3D, ma un unico lavoro.
 * La chiave è il nome dell'oggetto in Blender, il valore è l'id
 * del lavoro in src/data/lavoriModa.ts.
 */
export const CAPI_CLICCABILI: Record<string, string> = {
  capo_1: "capo_1",
  capo_2: "capo_2",
  capo_3: "capo_3",
  capo_4: "capo_4",
  capo_5: "capo_5",
  capo_6: "capo_6",
  capo_7: "capo_7",
  capo_7_minuteria: "capo_7",
}

export const VELOCITA_EVIDENZIAZIONE = 8
