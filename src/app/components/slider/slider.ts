import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class SliderComponent implements OnInit {
  movies: any[] = [];

  constructor(private movieService: MoviesService) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies: any[]) => {
      this.movies = movies; // <-- NON .data.results
      console.log('Film caricati:', this.movies);
    });
  }
}
