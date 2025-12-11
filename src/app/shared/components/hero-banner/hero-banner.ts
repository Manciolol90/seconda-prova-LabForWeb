import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDbService } from '../../../services/movie-db.service';
import { MoviesService } from '../../../services/movies.service';
import { AuthService } from '../../../services/auth.service';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner implements OnInit {
  films: Movie[] = [];
  currentFilmIndex = 0;
  currentFilm: Movie | null = null;
  isFading: boolean = false;

  constructor(
    private movieDbService: MovieDbService,
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Sottoscriviti allo stato login
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadMoviesFromDb();
      } else {
        this.loadMoviesFromTmdb();
      }
    });
  }

  loadMoviesFromTmdb() {
    this.moviesService.getPopularMovies().subscribe((movies) => {
      this.films = movies;
      this.startRotation();
    });
  }

  loadMoviesFromDb() {
    this.movieDbService.getSavedMovies().subscribe((movies) => {
      this.films = movies;
      this.startRotation();
    });
  }

  startRotation() {
    if (this.films.length === 0) return;

    this.currentFilm = this.films[0];
    setInterval(() => {
      this.isFading = true;

      setTimeout(() => {
        this.currentFilmIndex = (this.currentFilmIndex + 1) % this.films.length;
        this.currentFilm = this.films[this.currentFilmIndex];
        this.isFading = false;
      }, 500);
    }, 5000);
  }
}
