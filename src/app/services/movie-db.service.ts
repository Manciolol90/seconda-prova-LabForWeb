import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MovieDbService {
  private dbUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }
  saveMovie(movie: Movie): Observable<any> {
    return this.http.post(
      `${this.dbUrl}/movies`,
      { ...movie, tmdbId: movie.id },
      this.authHeaders()
    );
  }

  getSavedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.dbUrl}/movies`, this.authHeaders());
  }

  findMovieByTmdbId(tmdbId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.dbUrl}/movies?tmdbId=${tmdbId}`, this.authHeaders());
  }

  /** Controlla se un film è già salvato (per non duplicare) */
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.dbUrl}/movies/${id}`);
  }

  /** Cerca film tramite id TMDB */
}
