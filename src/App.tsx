/*
 * App
 * Componente radice. Contiene lo stato condiviso dell'interfaccia:
 * - armadioAperto: se l'armadio è aperto (ante aperte, LED acceso).
 *   Vive qui perché in futuro servirà sia alla scena 3D sia
 *   all'interfaccia HTML (galleria dei lavori, pulsante "chiudi").
 * Il click sull'armadio inverte lo stato (apre/chiude).
 */
import { useState } from "react"
import { Scena } from "./components/scena/Scena"

export default function App() {
  const [armadioAperto, setArmadioAperto] = useState(false)

  return (
    <Scena
      armadioAperto={armadioAperto}
      onClickArmadio={() => setArmadioAperto((aperto) => !aperto)}
    />
  )
}
