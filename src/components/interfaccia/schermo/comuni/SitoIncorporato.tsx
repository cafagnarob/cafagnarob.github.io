/*
 * Sito incorporato
 * Un sito vero (gioco, demo) dentro il browser, in un iframe che
 * riempie tutto lo spazio. Il sito deve permettere di essere incorporato
 * (GitHub Pages sì, github.com no: X-Frame-Options).
 */
import stili from "./SitoIncorporato.module.css"

type Props = { src: string; titolo: string }

export function SitoIncorporato({ src, titolo }: Props) {
  return (
    <iframe
      className={stili.sito}
      src={src}
      title={titolo}
      allow="autoplay; fullscreen"
    />
  )
}
