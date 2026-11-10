/*
 * Scheda identità
 * Gli elementi del marchio, ognuno nel suo pannello:
 * logo condensato, logo macchina da scrivere (ricostruito in testo
 * con Courier Prime: il PNG era troppo piccolo), la mosca, la palette
 * e i dettagli delle etichette sui capi.
 */
import type { CSSProperties } from "react"
import { IDENTITA_NOIA } from "../../../data/noia"
import { LogoNoia } from "./LogoNoia"
import { PannelloImmagine } from "./PannelloImmagine"
import stili from "./SchedaIdentita.module.css"

export function SchedaIdentita() {
  const { mosca, palette, dettagli } = IDENTITA_NOIA

  return (
    <div className={stili.griglia}>
      <figure className={`${stili.pannello} ${stili.scuro}`}>
        <figcaption className={stili.etichetta}>logo.png</figcaption>
        <LogoNoia className={stili.logo} />
      </figure>

      <figure className={stili.pannello}>
        <figcaption className={stili.etichetta}>logo_typewriter.png</figcaption>
        <span className={stili.macchina}>noia</span>
      </figure>

      <figure className={stili.pannello}>
        <figcaption className={stili.etichetta}>{mosca.nomeFile}</figcaption>
        <img
          className={stili.mosca}
          src={mosca.src}
          alt={mosca.alt}
          width={mosca.larghezza}
          height={mosca.altezza}
        />
      </figure>

      <figure className={stili.pannello}>
        <figcaption className={stili.etichetta}>palette.png</figcaption>
        <ul className={stili.palette}>
          {palette.map((colore) => (
            <li
              key={colore.nome}
              style={{ "--colore": colore.hex } as CSSProperties}
            >
              <span>{colore.nome}</span>
              <code>{colore.hex}</code>
            </li>
          ))}
        </ul>
      </figure>

      {dettagli.map((immagine) => (
        <PannelloImmagine key={immagine.src} immagine={immagine} />
      ))}
    </div>
  )
}
