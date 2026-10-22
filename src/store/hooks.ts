/*
 * Hook Redux tipizzati
 * Da usare al posto di useDispatch / useSelector: conoscono già i tipi
 * dello store, quindi TypeScript suggerisce i campi e segnala gli errori
 * (es. useAppSelector(s => s.scena.armadioAperto) è un boolean).
 */
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./store"

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
