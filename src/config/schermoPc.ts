/*
 * Schermo del PC nella stanza
 * Sfondo mostrato sul monitor (screen.001) quando la stanza è visibile.
 * - NOME_SCHERMO_PC: nome dell'oggetto come in Blender
 * - ASPETTO_SFONDO_PC: larghezza / altezza dell'immagine, serve al
 *   ritaglio "cover" (uvSulPiano) per non deformarla sul monitor
 * - LUMINOSITA_SCHERMO_PC: moltiplica i colori dell'immagine. La stanza
 *   è in penombra: se lo schermo "buca" troppo, abbassala (es. 0.8);
 *   se dopo la tonemapping AgX sembra spento, alzala (es. 1.3)
 * Il telefono tiene per ora il materiale provvisorio: il suo schermo è
 * verticale e avrà un'immagine sua.
 */
export const NOME_SCHERMO_PC = "screen.001"
export const PERCORSO_SFONDO_PC = "/images/schermi/sfondo_pc_1024.webp"
export const ASPETTO_SFONDO_PC = 1919 / 1200
export const LUMINOSITA_SCHERMO_PC = 1

/* Empty della vista PC (come in Blender): da qui si guarda il monitor,
   serve a capire qual è la faccia davanti dello schermo */
export const VUOTO_VISTA_PC = "vista_pc"
