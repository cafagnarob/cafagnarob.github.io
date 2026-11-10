/*
 * Scheda Noia: manifesto e identità insieme
 * Tre parti, come una pagina di rivista:
 * 1. Apertura — logo enorme, testi tecnici, la jungle mask con il
 *    blocco arancio dietro, la frase in verticale, il quadrato arancio
 *    con la freccia che porta al manifesto
 * 2. Manifesto — le righe d'apertura in grande, poi le sezioni numerate
 *    (01, 02…) in colonne, separate da barre nere
 * 3. Identità — logo, logo macchina da scrivere, mosca, palette e
 *    dettagli delle etichette, nella stessa griglia delle gallerie
 */
import type { CSSProperties } from "react"
import { COPERTINA_NOIA, IDENTITA_NOIA, MANIFESTO_NOIA } from "../../../data/noia"
import { LogoNoia } from "./LogoNoia"
import { PannelloImmagine } from "./PannelloImmagine"
import stili from "./SchedaNoia.module.css"

/* 1 → "01" */
const numero = (n: number) => String(n).padStart(2, "0")

export function SchedaNoia() {
  const { immagine, discipline, verticale } = COPERTINA_NOIA
  const { mosca, palette, dettagli } = IDENTITA_NOIA

  // Il primo blocco (solo righe) apre il manifesto; quelli senza titolo
  // diventano il paragrafo introduttivo; quelli con titolo, le sezioni
  const [apertura, ...resto] = MANIFESTO_NOIA
  const introduzione = resto.filter((b) => !b.titolo)
  const sezioni = resto.filter((b) => b.titolo)

  return (
    <article className={stili.noia}>
      {/* ── 1. Apertura ── */}
      <section className={stili.copertina} aria-label="NOIA">
        <div className={stili.colonnaTesto}>
          <LogoNoia className={stili.logo} />
          <p className={stili.tecnico}>
            a project by noia
            <br />
            FW22—23 // SS24
          </p>
          <ul className={stili.discipline}>
            {discipline.map((voce) => (
              <li key={voce}>{voce}</li>
            ))}
          </ul>
        </div>

        <figure className={stili.protagonista}>
          <span className={stili.blocco} aria-hidden="true" />
          <img
            src={immagine.src}
            alt={immagine.alt}
            width={immagine.larghezza}
            height={immagine.altezza}
          />
        </figure>

        <p className={stili.verticale}>{verticale}</p>

        <a href="#manifesto-noia" className={stili.giu} aria-label="Vai al manifesto">
          ↓
        </a>
      </section>

      {/* ── 2. Manifesto ── */}
      <section id="manifesto-noia" className={stili.manifesto} aria-label="Manifesto">
        <div className={stili.intestazione}>
          <span className={stili.etichetta}>manifesto</span>
          <span className={stili.barra} aria-hidden="true" />
        </div>

        <div className={stili.aperturaManifesto}>
          <img className={stili.mosca} src={mosca.src} alt="" width={mosca.larghezza} height={mosca.altezza} />
          <p className={stili.righe}>
            {apertura.righe?.map((riga) => (
              <span key={riga}>{riga}</span>
            ))}
          </p>
          {introduzione.flatMap((b) => b.paragrafi ?? []).map((p) => (
            <p key={p} className={stili.introduzione}>
              {p}
            </p>
          ))}
        </div>

        <ol className={stili.sezioni}>
          {sezioni.map((blocco, i) => (
            <li key={blocco.titolo} className={stili.sezione}>
              <span className={stili.numero}>{numero(i + 1)}</span>
              <h3 className={stili.titoloSezione}>{blocco.titolo}</h3>
              {blocco.paragrafi?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {blocco.righe?.map((riga) => (
                <p key={riga} className={stili.chiusa}>
                  {riga}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </section>

      {/* ── 3. Identità ── */}
      <section className={stili.identita} aria-label="Identità">
        <div className={stili.intestazione}>
          <span className={stili.etichetta}>identità</span>
          <span className={stili.barra} aria-hidden="true" />
        </div>

        <div className={stili.griglia}>
          <figure className={`${stili.tessera} ${stili.scura}`}>
            <figcaption>01 — logo.png</figcaption>
            <div className={stili.fondoLogo}>
              <LogoNoia className={stili.logoTessera} />
            </div>
          </figure>

          <figure className={stili.tessera}>
            <figcaption>02 — logo_typewriter.png</figcaption>
            <span className={stili.macchina}>noia</span>
          </figure>

          <figure className={stili.tessera}>
            <figcaption>03 — {mosca.nomeFile}</figcaption>
            <img className={stili.moscaTessera} src={mosca.src} alt={mosca.alt} width={mosca.larghezza} height={mosca.altezza} />
          </figure>

          <figure className={stili.tessera}>
            <figcaption>04 — palette.png</figcaption>
            <ul className={stili.palette}>
              {palette.map((colore) => (
                <li key={colore.nome} style={{ "--colore": colore.hex } as CSSProperties}>
                  <span>{colore.nome}</span>
                  <code>{colore.hex}</code>
                </li>
              ))}
            </ul>
          </figure>

          {dettagli.map((d, i) => (
            <PannelloImmagine key={d.src} immagine={d} numero={i + 5} />
          ))}
        </div>
      </section>
    </article>
  )
}
