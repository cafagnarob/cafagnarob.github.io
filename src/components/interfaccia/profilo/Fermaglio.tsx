/*
 * Fermaglio: disegno SVG di un fermacarte a pinza (corpo verde e
 * due anelli di metallo). Decorativo: nascosto agli screen reader.
 * Se lo disegni in Photoshop, sostituisci l'SVG con un <img>.
 */
export function Fermaglio({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 150" aria-hidden="true">
      <path
        d="M38 70 C34 30, 40 8, 60 8 C80 8, 86 30, 82 70"
        fill="none"
        stroke="#b9bcc0"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M46 70 C44 38, 48 20, 60 20 C72 20, 76 38, 74 70"
        fill="none"
        stroke="#8e9196"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M12 70 L108 70 L100 132 Q60 142 20 132 Z" fill="#1f5a3b" />
      <path d="M12 70 L108 70 L104 84 L16 84 Z" fill="#2b7a50" />
      <path
        d="M20 132 Q60 142 100 132"
        fill="none"
        stroke="#163f2a"
        strokeWidth="3"
      />
    </svg>
  )
}
