/* Chi sono: i paragrafi della presentazione */
import stili from "./ModaleProfilo.module.css"

export function SezioneChiSono({ paragrafi }: { paragrafi: string[] }) {
  return (
    <>
      {paragrafi.map((paragrafo) => (
        <p key={paragrafo} className={stili.testo}>
          {paragrafo}
        </p>
      ))}
    </>
  )
}
