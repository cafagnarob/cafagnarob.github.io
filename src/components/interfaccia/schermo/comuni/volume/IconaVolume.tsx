/*
 * Icona del volume
 * Altoparlante con 0, 1 o 2 onde secondo il livello, o una X se è 0
 * (muto o volume a zero). Stesso disegno di ControlliAudio.
 */
type Props = { livello: number; className?: string }

export function IconaVolume({ livello, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        {livello === 0 ? (
          <path d="M16 9l5 6M21 9l-5 6" />
        ) : (
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" />
            {livello > 0.5 && <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />}
          </>
        )}
      </g>
    </svg>
  )
}
