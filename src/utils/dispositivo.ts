/*
 * Dispositivo
 * eTouch: il puntatore principale è "grossolano" (un dito), cioè
 * telefono o tablet. Si chiede al browser al momento della chiamata,
 * quindi segue anche un cambio di dispositivo (es. modalità
 * dispositivo di Chrome, dopo il ricaricamento).
 */
export const eTouch = () => window.matchMedia("(pointer: coarse)").matches
