import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieDbService {
  private dbUrl = 'http://localhost:3000'; // JSON server

  constructor(private http: HttpClient) {}

  /** Salva un film nel db.json */
  saveMovie(movie: any): Observable<any> {
    const payload = {
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    return this.http.post(`${this.dbUrl}/movies`, payload);
  }

  /** Ottiene tutti i film salvati nel db.json */
  getSavedMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.dbUrl}/movies`);
  }

  /** Controlla se un film è già salvato (per non duplicare) */
  getMovieById(id: number): Observable<any> {
    return this.http.get(`${this.dbUrl}/movies/${id}`);
  }

  /** Cerca film tramite id TMDB */
  findMovieByTmdbId(tmdbId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.dbUrl}/movies?tmdbId=${tmdbId}`);
  }
}
