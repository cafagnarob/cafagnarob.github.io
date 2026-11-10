/*
 * CartellinoCapo
 * Decide QUANDO mostrare il cartellino: durante l'ispezione di un capo
 * (vetrina 360° o ispezione 3D), finché il capo non inizia a tornare
 * nell'armadio (ritornoCapo). key={id}: un altro capo = cartellino nuovo.
 */
import { useAppSelector } from "../../../store/hooks"
import { LAVORI_MODA } from "../../../data/lavoriModa"
import { Cartellino } from "./Cartellino"

export function CartellinoCapo() {
  const id = useAppSelector((s) => s.scena.capoInIspezione)
  const inRitorno = useAppSelector((s) => s.scena.ritornoCapo)

  if (!id || inRitorno) return null
  const lavoro = LAVORI_MODA[id]
  if (!lavoro) return null

  return <Cartellino key={id} id={id} lavoro={lavoro} />
}
