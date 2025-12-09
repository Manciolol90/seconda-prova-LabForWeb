import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { CommonModule } from '@angular/common';

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

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.moviesService.getPopularMovies().subscribe((res) => {
      this.films = res;
      this.currentFilm = this.films[0];

      setInterval(() => {
        this.currentFilmIndex = (this.currentFilmIndex + 1) % this.films.length;
        this.currentFilm = this.films[this.currentFilmIndex];
      }, 5000);
    });
  }
}
