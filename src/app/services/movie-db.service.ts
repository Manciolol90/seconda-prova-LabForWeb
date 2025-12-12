import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { AuthService } from './auth.service';
import { MoviesService } from './movies.service';

@Injectable({
  providedIn: 'root',
})
export class MovieDbService {
  private dbUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private moviesService: MoviesService
  ) {}

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

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.dbUrl}/movies/${id}`);
  }

  // -------------------------------------------------------------------------
  // ✨ NUOVA FUNZIONE: MERGE TRA DB E TMDB SENZA DUPLICATI
  // -------------------------------------------------------------------------
  getMergedMovies(): Observable<Movie[]> {
    const isLoggedIn = this.authService.getToken() !== null;

    if (!isLoggedIn) {
      // se non loggato → solo TMDB
      return this.moviesService.getPopularMovies();
    }

    // se loggato → carica entrambe le sorgenti
    return forkJoin({
      tmdb: this.moviesService.getPopularMovies(),
      db: this.getSavedMovies(),
    }).pipe(
      map(({ tmdb, db }) => {
        // normalizziamo i film del DB per avere sempre tmdbId
        const normalizedDb = db.map((m) => ({
          ...m,
          tmdbId: m.tmdbId ?? m.id, // fallback se manca tmdbId
        }));

        const existingIds = new Set(normalizedDb.map((m) => m.tmdbId));

        const filteredTmdb = tmdb.filter((m) => !existingIds.has(m.id));

        return [...normalizedDb, ...filteredTmdb];
      })
    );
  }
}
