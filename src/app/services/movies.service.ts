import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'fa1ce875640810b4229951a8d387315b'; // la tua API Key

  constructor(private http: HttpClient) {}

  /** Film popolari */
  getPopularMovies() {
    return this.http
      .get<any>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`)
      .pipe(map((res) => res.results));
  }
  getMovieDetails(id: number) {
    return this.http.get(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&language=it-IT`);
  }

  searchMovies(query: string) {
    return this.http.get(`${this.apiUrl}/search/movie?query=${query}&api_key=${this.apiKey}`);
  }
}
