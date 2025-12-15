import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

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
  isLoggedIn: boolean = false;
  alreadyInCart: boolean = false;
  alreadyPurchased: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MoviesService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovieDetails();

    // Stato login
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (!status) {
        this.alreadyPurchased = false;
        this.alreadyInCart = false;
      } else {
        this.subscribeCartChanges();
      }
    });
  }

  subscribeCartChanges() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.cartService.getCartObservable().subscribe((cart) => {
      // aggiorna già in cart
      this.alreadyInCart = cart?.movieIds.includes(this.movieId) ?? false;

      // aggiorna alreadyPurchased reattivamente
      this.cartService.getPurchasedMovies(userId).subscribe((purchased) => {
        this.alreadyPurchased = purchased.includes(this.movieId);
      });
    });
  }

  loadMovieDetails() {
    this.movieService.getMovieDetails(this.movieId).subscribe((details) => {
      this.movieDetails = details;
      this.checkCartAndPurchase();
    });
  }

  checkCartAndPurchase() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    // verifica se il film è già acquistato
    this.cartService.getPurchasedMovies(userId).subscribe((purchasedIds) => {
      this.alreadyPurchased = purchasedIds.includes(this.movieId);
    });

    // verifica se il film è già nel carrello
    this.cartService.getCart(userId).subscribe((cart) => {
      this.alreadyInCart = cart?.movieIds.includes(this.movieId) ?? false;
    });
  }

  addToCart() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.cartService.addMovieToCart(userId, this.movieId).subscribe(() => {
      console.log('Film aggiunto al carrello:', this.movieDetails);
    });
  }
  updateFlags() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    // verifica se il film è già acquistato
    this.cartService.getPurchasedMovies(userId).subscribe((purchasedIds) => {
      this.alreadyPurchased = purchasedIds.includes(this.movieId);
    });

    // non serve aggiornare giàInCart qui, lo aggiorniamo subito all'addToCart
  }

  purchaseMovie() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.cartService.purchaseCart(userId).subscribe(() => {
      console.log('Film acquistato:', this.movieDetails);
    });
  }
  playMovie() {
    console.log('Film acquistato:', this.movieDetails);
  }
}
