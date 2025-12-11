import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { Slider } from '../../shared/components/slider/slider';
import { MoviesService } from '../../services/movies.service';
import { MovieDbService } from '../../services/movie-db.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBanner, Slider],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  movies: Movie[] = [];
  loading = true;

  constructor(
    private tmdb: MoviesService,
    private localDb: MovieDbService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // ogni volta che cambia lo stato del login → ricarico i film
    this.auth.isLoggedIn$.subscribe(() => {
      this.loadMovies();
    });

    this.loadMovies(); // prima chiamata
  }

  loadMovies() {
    this.loading = true;

    const useLocal = this.auth.getToken() !== null;

    const source = useLocal ? this.localDb.getSavedMovies() : this.tmdb.getPopularMovies();

    source.subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: () => {
        console.error('Errore nel caricamento film');
        this.loading = false;
      },
    });
  }
}
