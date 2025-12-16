import { Component, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./home-page.scss'],
})
export class HomePage implements OnInit {
  @Input() movies: Movie[] = [];
  @Input() moviesFiltrati: Movie[] = [];
  loading = true;

  constructor(
    private tmdb: MoviesService,
    private localDb: MovieDbService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(() => {
      this.loadMovies();
    });

    this.loadMovies();
  }

  loadMovies() {
    this.loading = true;

    const isLoggedIn = this.auth.getToken() !== null;

    if (isLoggedIn) {
      this.localDb.mergeAndSaveMovies().subscribe({
        next: (movies) => {
          this.movies = movies;
          this.moviesFiltrati = movies;
          this.loading = false;
        },
        error: (err) => {
          console.error('Errore nel merge dei film', err);
          this.loading = false;
        },
      });
    } else {
      this.tmdb.getPopularMovies().subscribe({
        next: (movies) => {
          this.movies = movies;
          this.moviesFiltrati = movies;
          this.loading = false;
        },
        error: (err) => {
          console.error('Errore nel caricamento film da TMDB', err);
          this.loading = false;
        },
      });
    }
  }

  filtra(termine: string) {
    if (!termine) {
      this.moviesFiltrati = this.movies;
      return;
    }

    this.moviesFiltrati = this.movies.filter(
      (m) => m.title.toLowerCase().includes(termine) || m.overview.toLowerCase().includes(termine)
    );
  }
}
