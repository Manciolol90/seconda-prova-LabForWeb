import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
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
        'Content-Type': 'application/json',
      }),
    };
  }

  private saveMovie(movie: Movie): Observable<any> {
    return this.http
      .post(`${this.dbUrl}/660/movies`, { ...movie, tmdbId: movie.id }, this.authHeaders())
      .pipe(
        catchError((err) => {
          console.error('Errore POST movie', movie.title, err);
          return of(null);
        })
      );
  }

  mergeAndSaveMovies(): Observable<Movie[]> {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('Utente non loggato, nessun merge possibile');
      return this.moviesService.getPopularMovies();
    }

    return forkJoin({
      tmdb: this.moviesService.getPopularMovies(),
      db: this.getSavedMovies(),
    }).pipe(
      mergeMap(({ tmdb, db }) => {
        const existingIds = new Set(db.map((m) => m.tmdbId ?? m.id));
        const newMovies = tmdb.filter((m) => !existingIds.has(m.id));

        if (newMovies.length === 0) return of(db);

        const saves$ = newMovies.map((m) => this.saveMovie(m));
        return forkJoin(saves$).pipe(map(() => [...db, ...newMovies]));
      })
    );
  }

  getSavedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.dbUrl}/640/movies`, this.authHeaders()).pipe(
      catchError((err) => {
        console.error('Errore GET db.json', err);
        return of([]);
      })
    );
  }
}
