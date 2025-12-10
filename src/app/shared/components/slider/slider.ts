import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class Slider implements OnInit {
  movies: any[] = [];
  autoScrollInterval: any;

  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  constructor(private movieService: MoviesService) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      console.log('Film caricati:', this.movies);
    });
    this.startAutoScroll();
  }

  scrollRight() {
    const el = this.slider.nativeElement;

    // Se siamo alla fine → torna all'inizio
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 400, behavior: 'smooth' });
    }
    this.resetAutoScroll(); // resetta il timer
  }

  scrollLeft() {
    const el = this.slider.nativeElement;

    // Se siamo all'inizio → vai alla fine
    if (el.scrollLeft <= 20) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -400, behavior: 'smooth' });
    }
    this.resetAutoScroll(); // resetta il timer
  }
  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      const el = this.slider.nativeElement;
      console.log('Auto-scroll eseguito');

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 15000);
  }
  resetAutoScroll() {
    clearInterval(this.autoScrollInterval);
    this.startAutoScroll();
  }
  pauseAutoScroll() {
    clearInterval(this.autoScrollInterval);
  }

  resumeAutoScroll() {
    this.resetAutoScroll();
  }

  ngOnDestroy() {
    clearInterval(this.autoScrollInterval);
  }
}
