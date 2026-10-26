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
import { chiudiVetrina } from "./store/azioniScena"
import { PulsanteIndietro } from "./components/interfaccia/PulsanteIndietro"
import { InterfacciaSchermo } from "./components/interfaccia/InterfacciaSchermo"
import { ControlliAudio } from "./components/interfaccia/ControlliAudio"
import { Ingresso } from "./components/interfaccia/Ingresso"

import { ModaleProfilo } from "./components/interfaccia/profilo/ModaleProfilo"

export default function App() {
  const dispatch = useAppDispatch()
  const capoInIspezione = useAppSelector((s) => s.scena.capoInIspezione)
  const partenzaVetrina = useAppSelector((s) => s.scena.partenzaVetrina)

  const lavoro = capoInIspezione ? LAVORI_MODA[capoInIspezione] : undefined

  return (
    <>
      <Scena />
      <PulsanteIndietro />
      <ControlliAudio />
      <InterfacciaSchermo />

      <ModaleProfilo />

      {lavoro?.turntable && partenzaVetrina && (
        <VisoreTurntable
          key={capoInIspezione}
          titolo={lavoro.titolo}
          turntable={lavoro.turntable}
          partenza={partenzaVetrina}
          onChiuso={() => dispatch(chiudiVetrina())}
        />
      )}
      <Ingresso />
    </>
  )
}
