/*
 * Caricamento dei README
 * Scarica il README di un progetto e lo tiene in memoria.
 *
 * La cache è il punto chiave per use() di React: a ogni render, per lo
 * stesso indirizzo, React deve ricevere la STESSA promessa. Una fetch
 * nuova a ogni render sarebbe una promessa nuova: React sospenderebbe
 * di nuovo, all'infinito.
 *
 * In caso di errore la promessa si risolve con null (non viene
 * rifiutata): la pagina mostra un messaggio di riserva invece di
 * rompersi. L'errore resta in cache fino al ricaricamento della pagina.
 */
const cache = new Map<string, Promise<string | null>>()

export function caricaReadme(url: string): Promise<string | null> {
  let promessa = cache.get(url)
  if (!promessa) {
    promessa = fetch(url)
      .then((risposta) => (risposta.ok ? risposta.text() : null))
      .catch(() => null)
    cache.set(url, promessa)
  }
  return promessa
}
