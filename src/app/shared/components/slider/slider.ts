import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MovieDbService } from '../../../services/movie-db.service';
import { AuthService } from '../../../services/auth.service';
import { MoviesService } from '../../../services/movies.service';
import { Subscription } from 'rxjs';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class Slider implements OnInit, OnDestroy {
  @Input() movies: Movie[] = [];

  autoScrollInterval: any;

  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    clearInterval(this.autoScrollInterval);
  }

  ngOnChanges() {
    this.startAutoScroll();
  }

  scrollRight() {
    const el = this.slider.nativeElement;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 400, behavior: 'smooth' });
    }
    this.resetAutoScroll();
  }

  scrollLeft() {
    const el = this.slider.nativeElement;
    if (el.scrollLeft <= 20) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -400, behavior: 'smooth' });
    }
    this.resetAutoScroll();
  }

  startAutoScroll() {
    clearInterval(this.autoScrollInterval);
    this.autoScrollInterval = setInterval(() => {
      const el = this.slider.nativeElement;
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
}
