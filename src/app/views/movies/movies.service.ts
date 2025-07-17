import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError, Observable } from "rxjs";
import { Movies } from "./movies.model";

@Injectable({
    providedIn: 'root'
})
export class MoviesService {
    private readonly API_URL = 'http://localhost:3000/movies';

    constructor(private http: HttpClient) { }

    getMovies(): Observable<Movies> {
        return this.http.get<Movies>(this.API_URL).pipe(
            catchError(error => {
                console.error('Error fetching movies:', error);
                return throwError(() => error);
            })
        );
    }
}