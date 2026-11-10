/*
 * Preferenze audio
 * Muto e volume salvati nel browser di chi visita, così li ritrova alla
 * visita successiva. È solo una comodità: se il localStorage non è
 * disponibile (navigazione privata, dati bloccati) si usano i valori
 * predefiniti e il sito funziona lo stesso.
 */
const CHIAVE = "cameretta-audio"

export type PreferenzeAudio = { muto: boolean; volume: number }

const PREDEFINITE: PreferenzeAudio = { muto: false, volume: 0.8 }

export function leggiPreferenzeAudio(): PreferenzeAudio {
  try {
    const salvate = JSON.parse(localStorage.getItem(CHIAVE) ?? "null")
    if (
      typeof salvate?.muto === "boolean" &&
      typeof salvate?.volume === "number"
    ) {
      return {
        muto: salvate.muto,
        volume: Math.min(1, Math.max(0, salvate.volume)),
      }
    }
  } catch {
    // localStorage non disponibile o valore non valido: predefinite
  }
  return PREDEFINITE
}

export function salvaPreferenzeAudio(preferenze: PreferenzeAudio) {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(preferenze))
  } catch {
    // Non salvabile: pazienza, vale solo per questa visita
  }
}
