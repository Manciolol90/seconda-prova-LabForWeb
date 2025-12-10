import { Component, OnInit } from '@angular/core';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { Slider } from '../../shared/components/slider/slider';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../services/movies.service';
import { MovieDbService } from '../../services/movie-db.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBanner, Slider],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  constructor(private moviesService: MoviesService, private movieDb: MovieDbService) {}

  ngOnInit() {
    this.savePopularMoviesToDb();
  }

  /** STEP 2 — Salvataggio film TMDB nel JSON server */
  savePopularMoviesToDb() {
    this.moviesService.getPopularMovies().subscribe((movies) => {
      movies.forEach((movie: Movie) => {
        // 1) controlla se è già nel DB
        this.movieDb.findMovieByTmdbId(movie.id).subscribe((found) => {
          if (found.length === 0) {
            // 2) se NON esiste → lo salvo
            this.movieDb.saveMovie(movie).subscribe(() => {
              console.log('✔ Salvato nel DB:', movie.title);
            });
          } else {
            console.log('⏭ Già presente:', movie.title);
          }
        });
      });
    });
  }
}
