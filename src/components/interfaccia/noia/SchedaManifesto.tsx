/*
 * Scheda manifesto
 * Legge i blocchi di MANIFESTO_NOIA e li impagina:
 * - righe   → frasi brevi in grande, una per riga
 * - paragrafi → testo normale dentro un pannello crema
 * La mosca "ronza" in un angolo con una piccola animazione CSS
 * (ferma se l'utente ha chiesto meno movimento).
 */
import { IDENTITA_NOIA, MANIFESTO_NOIA } from "../../../data/noia"
import stili from "./SchedaManifesto.module.css"

export function SchedaManifesto() {
  const { mosca } = IDENTITA_NOIA

  return (
    <article className={stili.manifesto}>
      <img
        className={stili.mosca}
        src={mosca.src}
        alt=""
        width={mosca.larghezza}
        height={mosca.altezza}
      />

      {MANIFESTO_NOIA.map((blocco, i) => (
        <section
          key={i}
          className={blocco.paragrafi ? stili.pannello : stili.apertura}
        >
          {blocco.titolo && <h2 className={stili.titolo}>{blocco.titolo}</h2>}

          {blocco.paragrafi?.map((paragrafo) => (
            <p key={paragrafo} className={stili.paragrafo}>
              {paragrafo}
            </p>
          ))}

          {blocco.righe && (
            <p className={stili.righe}>
              {blocco.righe.map((riga) => (
                <span key={riga}>{riga}</span>
              ))}
            </p>
          )}
        </section>
      ))}
    </article>
  )
}
