/*
 * useTextureBake
 * Carica un elenco di texture (chiave → percorso del PNG) come useTexture,
 * ma con USA_KTX2 attivo legge i .ktx2 con lo stesso nome.
 *
 * - L'hook di caricamento è scelto UNA volta, al caricamento del modulo
 *   (USA_KTX2 è una costante): a ogni render si chiama sempre lo stesso
 *   hook, come vogliono le regole degli hook.
 * - useKTX2 lavora con elenchi: ricostruiamo l'oggetto chiave → texture.
 *   useMemo lo tiene stabile: chi lo usa (lo useMemo dei materiali) non
 *   viene ricalcolato a ogni render.
 * - Le texture KTX2 hanno già l'origine in alto a sinistra (convenzione
 *   glTF), quindi preparaTextureBake (flipY = false) vale per entrambe.
 */
import { useMemo } from "react"
import type * as THREE from "three"
import { useKTX2, useTexture } from "@react-three/drei"
import { PERCORSO_BASIS, USA_KTX2 } from "../config/texture"

const comeKtx2 = (percorso: string) => percorso.replace(/\.png$/i, ".ktx2")

function useElencoKtx2(percorsi: string[]) {
  return useKTX2(percorsi, PERCORSO_BASIS) as THREE.Texture[]
}

function useElencoPng(percorsi: string[]) {
  return useTexture(percorsi) as THREE.Texture[]
}

const useElenco = USA_KTX2 ? useElencoKtx2 : useElencoPng
const percorsoReale = (percorso: string) =>
  USA_KTX2 ? comeKtx2(percorso) : percorso

export function useTextureBake(
  url: Record<string, string>,
): Record<string, THREE.Texture> {
  const chiavi = Object.keys(url)
  const elenco = useElenco(chiavi.map((chiave) => percorsoReale(url[chiave])))
  return useMemo(
    () => Object.fromEntries(chiavi.map((chiave, i) => [chiave, elenco[i]])),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- "url" è una costante del modulo
    [elenco],
  )
}

/* Precaricamento: solo per i PNG. Il KTX2 non si può precaricare fuori
   dal Canvas: il loader deve chiedere al renderer quali formati
   compressi supporta la scheda video (detectSupport), e all'import del
   modulo il renderer non esiste ancora. Non serve comunque: la stanza
   si monta subito, dietro la pagina iniziale, e i download partono lì. */
export function precaricaTextureBake(url: Record<string, string>) {
  if (USA_KTX2) return
  useTexture.preload(Object.values(url))
}
