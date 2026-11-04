/*
 * Spettro di LED
 * Colonne di LIVELLI LED (verde, giallo dal 7°, rosso dal 10°):
 * - desktop: 25 bande di frequenza, bassi a sinistra, acuti a destra
 * - mobile: 2 colonne, canale sinistro e destro, con "L R" inciso sotto
 * Il componente disegna solo i LED; ad accenderli è motoreSpettro, che
 * scrive --livello su ogni colonna. La callback ref registra le colonne
 * quando compaiono nel DOM e restituisce la pulizia (React 19): niente
 * useEffect. useCallback la tiene stabile tra un render e l'altro,
 * altrimenti React la staccherebbe e riattaccherebbe a ogni render.
 * Misure da config (VARIANTI_PANNELLO), passate al CSS come variabili.
 * Decorativo per gli screen reader (aria-hidden).
 */
import { useCallback, type CSSProperties } from "react"
import {
  LIVELLI,
  SOGLIA_GIALLO,
  SOGLIA_ROSSO,
  VARIANTI_PANNELLO,
  type VariantePannello,
} from "../../../config/pannelloAudio"
import { registraSpettro } from "./motoreSpettro"
import stili from "./Spettro.module.css"
import luce from "./Led.module.css"
import { Etichetta } from "./Etichetta"

const tintaDi = (led: number) =>
  led >= SOGLIA_ROSSO
    ? luce.rosso
    : led >= SOGLIA_GIALLO
      ? luce.giallo
      : luce.verde

export function Spettro({ variante }: { variante: VariantePannello }) {
  const { colonne, led, gapVerticale, gapColonne } = VARIANTI_PANNELLO[variante]

  const collega = useCallback(
    (griglia: HTMLDivElement | null) => {
      if (!griglia) return
      const elementi = Array.from(griglia.children) as HTMLElement[]
      return registraSpettro(elementi, variante)
    },
    [variante],
  )

  const misure = {
    "--led": `${led}px`,
    "--gap-verticale": `${gapVerticale}px`,
    "--gap-colonne": `${gapColonne}px`,
  } as CSSProperties

  return (
    <div
      className={`${stili.spettro} ${stili[variante]}`}
      style={misure}
      aria-hidden="true"
    >
      <div ref={collega} className={stili.colonne}>
        {Array.from({ length: colonne }, (_, c) => (
          <span key={c} className={stili.colonna}>
            {Array.from({ length: LIVELLI }, (_, i) => (
              <span
                key={i}
                className={`${luce.led} ${tintaDi(i + 1)} ${stili.ledColonna}`}
                style={{ "--i": i + 1 } as CSSProperties}
              />
            ))}
          </span>
        ))}
      </div>

      {variante === "mobile" && (
        <div className={stili.canali}>
          <Etichetta nome="l" />
          <Etichetta nome="r" />
        </div>
      )}
    </div>
  )
}
