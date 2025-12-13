import { Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss'],
})
export class HeroBanner implements OnChanges, OnDestroy {
  @Input() movies: Movie[] = [];

  currentFilmIndex = 0;
  currentFilm: Movie | null = null;
  isFading = false;
  private rotationInterval: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movies']) {
      this.startRotation();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.rotationInterval);
  }

  private startRotation() {
    clearInterval(this.rotationInterval);

    if (!this.movies || this.movies.length === 0) {
      this.currentFilm = null;
      return;
    }

    this.currentFilmIndex = 0;
    this.currentFilm = this.movies[0];

    this.rotationInterval = setInterval(() => {
      this.isFading = true;

      setTimeout(() => {
        this.currentFilmIndex = (this.currentFilmIndex + 1) % this.movies.length;
        this.currentFilm = this.movies[this.currentFilmIndex];
        this.isFading = false;
      }, 500);
    }, 5000);
  }
}
