import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieDbService {
  private dbUrl = 'http://localhost:3000'; // JSON server

  constructor(private http: HttpClient) {}

  /** Salva un film nel db.json */
  saveMovie(movie: Movie) {
    return this.http.post(`${this.dbUrl}/movies`, {
      ...movie,
      tmdbId: movie.id, // salviamo l'id TMDB
    });
  }

  /** Ottiene tutti i film salvati nel db.json */
  getSavedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.dbUrl}/movies`);
  }

  /** Controlla se un film è già salvato (per non duplicare) */
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.dbUrl}/movies/${id}`);
  }

  /** Cerca film tramite id TMDB */
  findMovieByTmdbId(tmdbId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.dbUrl}/movies?tmdbId=${tmdbId}`);
  }
}
