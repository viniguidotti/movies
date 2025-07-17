import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WikipediaService {
    constructor(private http: HttpClient) { }

    async openWikipedia(imdbId: string | null, movieTitle: string): Promise<void> {
        if (!imdbId) {
            const fallbackUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(movieTitle)}`;
            // @ts-ignore
            window.electronAPI.openExternal(fallbackUrl);
            return;
        }

        const sparqlQuery = `SELECT ?article WHERE {
    ?item wdt:P345 "${imdbId}" .
    ?article schema:about ?item .
    ?article schema:inLanguage "en" .
    ?article schema:isPartOf <https://en.wikipedia.org/> .
  } LIMIT 1`;

        const queryUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`;
        const headers = new HttpHeaders({ 'Accept': 'application/sparql-results+json' });

        try {
            const response: any = await firstValueFrom(this.http.get(queryUrl, { headers }));
            const article = response?.results?.bindings?.[0]?.article?.value;

            if (article) {
                // @ts-ignore
                window.electronAPI.openExternal(article);
            } else {
                const fallbackUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(movieTitle)}`;
                // @ts-ignore
                window.electronAPI.openExternal(fallbackUrl);
            }
        } catch (error) {
            console.error('Erro ao buscar na Wikidata:', error);
            const fallbackUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(movieTitle)}`;
            // @ts-ignore
            window.electronAPI.openExternal(fallbackUrl);
        }
    }
}
