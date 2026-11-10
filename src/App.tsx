/*
 * App
 * Componente radice: mostra la scena 3D e, sopra, la vetrina del capo
 * con turntable quando è aperta.
 *
 * - Lo stato condiviso è nello store Redux (store/sliceScena.ts).
 * - Le azioni con effetti (camera, precaricamento) sono i thunk di
 *   store/azioniScena.ts, senza useEffect.
 * - key={capoInIspezione}: un capo diverso = un visore nuovo, con lo
 *   stato interno (zoom, fotogramma) ripartito da zero.
 */
import { Scena } from "./components/scena/Scena"
import { VisoreTurntable } from "./components/interfaccia/VisoreTurntable"
import { LAVORI_MODA } from "./data/lavoriModa"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { chiudiVetrina, rimettiCapo } from "./store/azioniScena"
import { PulsanteIndietro } from "./components/interfaccia/PulsanteIndietro"
import { InterfacciaSchermo } from "./components/interfaccia/InterfacciaSchermo"

import { Ingresso } from "./components/interfaccia/Ingresso"
import { ModaleProfilo } from "./components/interfaccia/profilo/ModaleProfilo"
import { PannelloAudio } from "./components/interfaccia/audio/PannelloAudio"
import { CartellinoCapo } from "./components/interfaccia/capi/CartellinoCapo"
import { FinestraNoia } from "./components/interfaccia/noia/FinestraNoia"
import { FinestraAudioPanel } from "./components/interfaccia/audioPanel/FinestraAudioPanel"

export default function App() {
  const dispatch = useAppDispatch()
  const capoInIspezione = useAppSelector((s) => s.scena.capoInIspezione)
  const partenzaVetrina = useAppSelector((s) => s.scena.partenzaVetrina)

  const lavoro = capoInIspezione ? LAVORI_MODA[capoInIspezione] : undefined

  return (
    <>
      <Scena />
      <PulsanteIndietro />
      <PannelloAudio />
      <InterfacciaSchermo />

      <ModaleProfilo />
      <CartellinoCapo />

      {lavoro?.turntable && partenzaVetrina && (
        <VisoreTurntable
          key={capoInIspezione}
          titolo={lavoro.titolo}
          turntable={lavoro.turntable}
          partenza={partenzaVetrina}
          onChiuso={() => dispatch(chiudiVetrina())}
          onRitorno={() => dispatch(rimettiCapo())}
        />
      )}
      <Ingresso />
      <FinestraNoia />
      <FinestraAudioPanel />
    </>
  )
}
