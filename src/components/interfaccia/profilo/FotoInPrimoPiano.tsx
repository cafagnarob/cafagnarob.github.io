/*
 * Foto in primo piano
 * Copia HTML della foto del profilo che "esce" dal portafoto 3D e vola
 * accanto al modale (tecnica FLIP, come la vetrina dei capi):
 *   First  → rettangolo della foto 3D sullo schermo (rettangoloFoto)
 *   Last   → posizione finale decisa dal CSS (getBoundingClientRect)
 *   Invert → transform che riporta la copia sulla foto 3D
 *   Play   → animazione del transform fino a zero
 * In partenza è scurita e calda come la luce della stanza; all'arrivo
 * ha i colori pieni.
 *
 * - Callback ref: chiamata quando l'immagine entra nella pagina, prima
 *   che venga disegnata. Misura e partenza del volo senza mai mostrarla
 *   nella posizione sbagliata, e senza useEffect.
 * - La foto 3D viene nascosta finché la copia è in pagina; la funzione
 *   restituita dalla ref (React 19) la fa riapparire alla chiusura.
 * - useCallback con [] → sempre la stessa funzione: React la chiama una
 *   sola volta, non a ogni render.
 * - Un clic sulla foto non chiude il modale.
 */
import { useCallback } from "react"
import {
  DURATA_VOLO_FOTO_MS,
  PERCORSO_FOTO,
  RITARDO_VOLO_FOTO_MS,
} from "../../../config/profilo"
import { meshFoto, rettangoloFoto } from "../../stanza/puntoFoto"
import stili from "./ModaleProfilo.module.css"

/* Luce della stanza sulla foto 3D (circa COLORE_FOTO) */
const FILTRO_STANZA = "brightness(0.85) sepia(0.2)"

export function FotoInPrimoPiano() {
  const collegaFoto = useCallback((immagine: HTMLImageElement | null) => {
    if (!immagine) return

    const partenza = rettangoloFoto()
    const arrivo = immagine.getBoundingClientRect()
    if (partenza && arrivo.width > 0 && arrivo.height > 0) {
      const dx = partenza.x - arrivo.left
      const dy = partenza.y - arrivo.top
      const sx = partenza.larghezza / arrivo.width
      const sy = partenza.altezza / arrivo.height
      immagine.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            filter: FILTRO_STANZA,
          },
          { transform: "none", filter: "none" },
        ],
        {
          duration: DURATA_VOLO_FOTO_MS,
          delay: RITARDO_VOLO_FOTO_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards", // durante il ritardo resta sulla foto 3D
        },
      )
    }

    // La foto "esce" dalla cornice: quella 3D sparisce finché la copia c'è
    const mesh = meshFoto()
    if (mesh) mesh.visible = false
    return () => {
      if (mesh) mesh.visible = true
    }
  }, [])

  return (
    <img
      ref={collegaFoto}
      className={stili.foto}
      src={PERCORSO_FOTO}
      alt="Roberto Cafagna"
      draggable={false}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
