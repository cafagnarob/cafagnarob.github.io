/*
 * useVolume
 * Il volume del sito per i comandi delle interfacce (desktop,
 * telefono): legge muto e volume dallo slice "audio" e restituisce le
 * azioni già pronte. Sono le stesse di ControlliAudio: un solo volume
 * per tutto il sito, qualunque comando lo cambi.
 * - livello: ciò che si mostra (0 se muto, altrimenti il volume)
 */
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks"
import { alternaMuto, impostaVolume } from "../../../../../store/azioniAudio"

export function useVolume() {
  const dispatch = useAppDispatch()
  const muto = useAppSelector((s) => s.audio.muto)
  const volume = useAppSelector((s) => s.audio.volume)

  return {
    muto,
    livello: muto ? 0 : volume,
    alterna: () => dispatch(alternaMuto()),
    imposta: (valore: number) => dispatch(impostaVolume(valore)),
  }
}
