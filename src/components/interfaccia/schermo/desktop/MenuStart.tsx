/*
 * Menu Start
 * Si apre dal pulsante Start della barra, come su Windows 11:
 * - "Progetti": le app, il clic apre il browser sul progetto
 * - in fondo: il tuo profilo (foto e nome) e "Spegni", che spegne il
 *   desktop con l'effetto di un vecchio monitor e torna alla stanza
 *   (lo stesso di Esc, che resta attivo)
 * La chiusura cliccando fuori la gestisce Desktop (velo trasparente).
 */
import { PROGETTI, type Progetto } from "../../../../data/progetti"
import { PROFILO } from "../../../../data/profilo"
import { PERCORSO_FOTO } from "../../../../config/profilo"
import { IconaProgetto } from "../comuni/IconaProgetto"
import stili from "./MenuStart.module.css"

type Props = {
  onApri: (progetto: Progetto) => void
  onSpegni: () => void
}

export function MenuStart({ onApri, onSpegni }: Props) {
  return (
    <div className={stili.menu} role="dialog" aria-label="Menu Start">
      <p className={stili.sezione}>Progetti</p>
      <ul className={stili.app}>
        {PROGETTI.map((progetto) => (
          <li key={progetto.id}>
            <button
              type="button"
              className={stili.voce}
              onClick={() => onApri(progetto)}
            >
              <IconaProgetto progetto={progetto} className={stili.iconaVoce} />
              <span>{progetto.nome}</span>
            </button>
          </li>
        ))}
      </ul>

      <footer className={stili.piede}>
        <span className={stili.utente}>
          <img className={stili.avatar} src={PERCORSO_FOTO} alt="" />
          {PROFILO.nome}
        </span>
        <button
          type="button"
          className={stili.spegni}
          onClick={onSpegni}
          autoFocus
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 3v9" />
            <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
          </svg>
          Spegni
        </button>
      </footer>
    </div>
  )
}
