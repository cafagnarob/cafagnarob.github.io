/*
 * Stanza
 * Carica il modello della stanza e mette insieme i suoi pezzi:
 * - materiali (materialiStanza.ts), assegnati una sola volta prima del
 *   primo disegno; nello stesso momento si registrano viste e schermi,
 *   letti dal modello (empty vista_… / guarda_…, mesh degli schermi)
 * - interazioni: alone e clic (useInterazioniStanza.ts)
 * - luci animate: neon e alone (useLuciStanza.ts)
 * - giradischi (useGiradischi.ts) e audio d'ambiente (useAudioAmbiente.ts)
 * - auto e luce lampeggiante fuori dalla finestra (FuoriFinestra.tsx)
 *
 * L'ordine conta: useAudioAmbiente e FuoriFinestra leggono le viste,
 * registrate nello useMemo qui sotto.
 * fumo_tazza resta un segnaposto per il fumo, più avanti.
 */
import { useMemo } from "react"
import { useGLTF, useTexture } from "@react-three/drei"
import { PERCORSO_MODELLO_STANZA } from "../../config/stanza"
import { registraVisteDaScena } from "../scena/viste"
import { registraSchermi } from "../scena/schermi"
import { URL_TEXTURE } from "./textureStanza"
import { assegnaMaterialiStanza } from "./materialiStanza"
import { useInterazioniStanza } from "./useInterazioniStanza"
import { useLuciStanza } from "./useLuciStanza"
import { useGiradischi } from "./useGiradischi"
// import { useAudioAmbiente } from "./useAudioAmbiente"
import { FuoriFinestra } from "./FuoriFinestra"
import { Fumo } from "./Fumo"
import { usePioggia } from "./usePioggia"
import {
  precaricaTextureBake,
  useTextureBake,
} from "../../utils/useTextureBake"
import { PERCORSO_DRACO } from "../../config/texture"
import { TracciaFoto } from "./TracciaFoto"
import { FotoProfilo } from "./FotoProfilo"

import { PERCORSI_SFONDI } from "../../config/sfondiSchermi"

export function Stanza() {
  const { scene } = useGLTF(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)

  const texture = useTextureBake(URL_TEXTURE)
  const sfondi = useTexture(PERCORSI_SFONDI)

  const materiali = useMemo(() => {
    const animati = assegnaMaterialiStanza(scene, texture, sfondi)
    registraVisteDaScena(scene)
    registraSchermi(scene)
    return animati
  }, [scene, texture, sfondi])

  const { sottoMouse, gestori } = useInterazioniStanza()
  useLuciStanza(materiali, sottoMouse)
  useGiradischi(scene)
  // useAudioAmbiente(scene)
  usePioggia(materiali.pioggia)

  return (
    <>
      <primitive object={scene} {...gestori} />
      <FuoriFinestra />
      <Fumo />
      <TracciaFoto />

      <FotoProfilo />
    </>
  )
}

useGLTF.preload(PERCORSO_MODELLO_STANZA, PERCORSO_DRACO)
precaricaTextureBake(URL_TEXTURE)
useTexture.preload(Object.values(PERCORSI_SFONDI))
