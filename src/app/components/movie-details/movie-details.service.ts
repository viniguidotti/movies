import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, catchError, throwError, Observable } from "rxjs";
import { Credits } from "./credits.model";

@Injectable({
    providedIn: 'root'
})
export class MoviesDetailsService {
    private readonly API_URL = 'http://localhost:3000/movies';

    constructor(private http: HttpClient) { }

    getMovieCreditsById(movieId: string): Observable<Credits> {
        return this.http.get<Credits>(`${this.API_URL}/${movieId}/credits`).pipe(
            tap(credits => {
                return credits
            }),
            catchError(error => {
                console.error('Error fetching movies:', error);
                return throwError(error);
            })
        );
    }
}