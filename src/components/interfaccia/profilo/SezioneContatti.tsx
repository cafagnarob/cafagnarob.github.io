/*
 * Contatti e CV
 * - I link esterni si aprono in una nuova scheda (target _blank con
 *   rel noopener: la pagina aperta non può controllare il portfolio).
 * - L'email apre il programma di posta (mailto:).
 * - Il CV si scarica (download) invece di aprirsi nel browser.
 */
import type { Contatto } from "../../../data/profilo"
import stili from "./ModaleProfilo.module.css"

type Props = {
  contatti: Contatto[]
  cv: { etichetta: string; href: string }
}

export function SezioneContatti({ contatti, cv }: Props) {
  return (
    <>
      <ul className={stili.contatti}>
        {contatti.map(({ etichetta, valore, href }) => {
          const esterno = href.startsWith("http")
          return (
            <li key={etichetta}>
              <a
                className={stili.contatto}
                href={href}
                {...(esterno
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className={stili.etichettaContatto}>{etichetta}</span>
                <span>{valore}</span>
              </a>
            </li>
          )
        })}
      </ul>
      <div className="scaricaCv">
        <a className={stili.cv} href={cv.href} download>
          {cv.etichetta}
        </a>
      </div>
    </>
  )
}
