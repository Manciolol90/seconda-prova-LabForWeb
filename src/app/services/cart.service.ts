import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

interface Cart {
  id: number;
  userId: number;
  movieIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cart$ = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart[]>(`${this.apiUrl}/carts?userId=${userId}`).pipe(
      map((carts) => (carts.length > 0 ? carts[0] : { id: 0, userId, movieIds: [] })),
      tap((cart) => this.cart$.next(cart))
    );
  }

  addMovieToCart(userId: number, movieId: number): Observable<Cart> {
    return this.getCart(userId).pipe(
      map((cart) => {
        if (!cart.movieIds.includes(movieId)) {
          cart.movieIds.push(movieId);
        }
        return cart;
      }),
      tap((cart) => {
        if (cart.id === 0) {
          this.http.post<Cart>(`${this.apiUrl}/carts`, cart).subscribe();
        } else {
          this.http.put<Cart>(`${this.apiUrl}/carts/${cart.id}`, cart).subscribe();
        }
        this.cart$.next(cart);
      })
    );
  }

  getPurchasedMovies(userId: number): Observable<number[]> {
    return this.http
      .get<{ movieIds: number[] }[]>(`${this.apiUrl}/orders?userId=${userId}`)
      .pipe(map((orders) => orders.flatMap((o) => o.movieIds)));
  }

  purchaseCart(userId: number): Observable<any> {
    return this.getCart(userId).pipe(
      map((cart) => {
        if (!cart || cart.movieIds.length === 0) return null;

        const order = {
          userId,
          movieIds: [...cart.movieIds],
          date: new Date().toISOString(),
        };

        this.http.post(`${this.apiUrl}/orders`, order).subscribe();

        cart.movieIds = [];
        if (cart.id !== 0) {
          this.http.put(`${this.apiUrl}/carts/${cart.id}`, cart).subscribe();
        }

        this.cart$.next(cart);
        return order;
      })
    );
  }

  getCartObservable(): Observable<Cart | null> {
    return this.cart$.asObservable();
  }

  getMovieById(movieId: number): Movie {
    return {
      id: movieId,
      title: 'Film ' + movieId,
      overview: '',
      poster_path: '',
      backdrop_path: '',
      release_date: '',
      vote_average: 0,
    };
  }

  removeMovieFromCart(userId: number, movieId: number): Observable<Cart> {
    return this.getCart(userId).pipe(
      map((cart) => {
        cart.movieIds = cart.movieIds.filter((id) => id !== movieId);
        return cart;
      }),
      tap((cart) => {
        if (cart.id !== 0) {
          this.http.put<Cart>(`${this.apiUrl}/carts/${cart.id}`, cart).subscribe();
        }
        this.cart$.next(cart);
      })
    );
  }
}
