import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  movieId!: number;
  movieDetails: any;

  constructor(private route: ActivatedRoute, private movieService: MoviesService) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovieDetails();
  }

  loadMovieDetails() {
    this.movieService.getMovieDetails(this.movieId).subscribe((details) => {
      this.movieDetails = details;
    });
  }
}
