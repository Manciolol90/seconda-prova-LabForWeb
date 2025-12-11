import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDbService } from '../../../services/movie-db.service';
import { MoviesService } from '../../../services/movies.service';
import { AuthService } from '../../../services/auth.service';
import { Movie } from '../../../models/movie.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss'],
})
export class HeroBanner implements OnInit, OnDestroy {
  @Input() movies: Movie[] = [];

  films: Movie[] = [];
  currentFilmIndex = 0;
  currentFilm: Movie | null = null;
  isFading: boolean = false;
  private authSub!: Subscription;
  private rotationInterval: any;

  constructor(
    private movieDbService: MovieDbService,
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Caricamento iniziale da TMDB
    this.loadMoviesFromTmdb();

    // Poi, se loggato, sovrascrivi con DB
    this.authService.isLoggedIn$.subscribe((isLoggedIn: any) => {
      if (isLoggedIn) {
        this.loadMoviesFromDb();
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.rotationInterval);
    this.authSub?.unsubscribe();
  }

  private loadMoviesFromTmdb() {
    this.moviesService.getPopularMovies().subscribe((movies) => {
      this.films = movies;
      this.startRotation();
    });
  }

  private loadMoviesFromDb() {
    this.movieDbService.getSavedMovies().subscribe((movies) => {
      this.films = movies;
      this.startRotation();
    });
  }

  private startRotation() {
    if (!this.films || this.films.length === 0) return;

    this.currentFilmIndex = 0;
    this.currentFilm = this.films[0];
    clearInterval(this.rotationInterval);

    this.rotationInterval = setInterval(() => {
      this.isFading = true;

      setTimeout(() => {
        this.currentFilmIndex = (this.currentFilmIndex + 1) % this.films.length;
        this.currentFilm = this.films[this.currentFilmIndex];
        this.isFading = false;
      }, 500);
    }, 5000);
  }
}
