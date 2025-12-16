import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { MovieDbService } from '../../services/movie-db.service';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './library.html',
  styleUrls: ['./library.scss'],
})
export class Library implements OnInit {
  allPurchasedMovies: Movie[] = [];
  purchasedMovies: Movie[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private movieDbService: MovieDbService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.cartService.getPurchasedMovies(userId).subscribe((ids) => {
          if (ids.length === 0) {
            this.allPurchasedMovies = [];
            this.purchasedMovies = [];
            return;
          }

          this.movieDbService.getSavedMovies().subscribe((movies) => {
            this.allPurchasedMovies = movies.filter((m) => ids.includes(m.id));
            this.purchasedMovies = [...this.allPurchasedMovies];
          });
        });
      } else {
        this.allPurchasedMovies = [];
        this.purchasedMovies = [];
      }
    });
  }

  filtra(termine: string) {
    const t = termine.toLowerCase();
    this.purchasedMovies = this.allPurchasedMovies.filter((m) => m.title.toLowerCase().includes(t));
  }
}
