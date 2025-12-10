import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { CommonModule } from '@angular/common';
import { MovieDbService } from '../../../services/movie-db.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner implements OnInit {
  films: any[] = [];
  currentFilmIndex = 0;
  currentFilm: any = null;
  isFading: boolean = false;

  constructor(private movieDbService: MovieDbService) {}

  ngOnInit(): void {
    this.movieDbService.getSavedMovies().subscribe((res) => {
      this.films = res;
      this.currentFilm = this.films[0];

      setInterval(() => {
        this.isFading = true;

        setTimeout(() => {
          this.currentFilmIndex = (this.currentFilmIndex + 1) % this.films.length;
          this.currentFilm = this.films[this.currentFilmIndex];
          this.isFading = false;
        }, 500); // durata fade out + swap + fade in
      }, 5000);
    });
  }
}
