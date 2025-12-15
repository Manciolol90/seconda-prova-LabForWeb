import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

interface Cart {
  id: number;
  userId: number;
  movieIds: number[];
}

interface User {
  id: number;
  email: string;
  nome: string;
  password: string;
  cart?: number[]; // opzionale, per comodità
  purchased?: number[]; // opzionale
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cart$ = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  /** Ottieni il carrello di un utente */
  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart[]>(`${this.apiUrl}/carts?userId=${userId}`).pipe(
      map((carts) => carts[0] || { id: 0, userId, movieIds: [] }),
      tap((cart) => this.cart$.next(cart))
    );
  }

  /** Ottieni i film già acquistati dall’utente */
  getPurchasedMovies(userId: number): Observable<number[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?id=${userId}`)
      .pipe(map((users) => users[0]?.purchased || []));
  }

  /** Aggiungi un film al carrello */
  addMovieToCart(userId: number, movieId: number): Observable<Cart> {
    return this.getCart(userId).pipe(
      map((cart) => {
        if (!cart.movieIds.includes(movieId)) {
          cart.movieIds.push(movieId);
        }
        return cart;
      }),
      tap((cart) => {
        // aggiorna il DB
        if (cart.id === 0) {
          // carrello inesistente, crealo
          this.http
            .post<Cart>(`${this.apiUrl}/carts`, { userId, movieIds: cart.movieIds })
            .subscribe();
        } else {
          this.http.put<Cart>(`${this.apiUrl}/carts/${cart.id}`, cart).subscribe();
        }
        this.cart$.next(cart);
      })
    );
  }

  /** Checkout: sposta i film dal carrello agli acquisti dell’utente */
  checkout(userId: number): Observable<void> {
    return this.getCart(userId).pipe(
      map((cart) => cart.movieIds),
      tap((movieIds) => {
        this.http.get<User[]>(`${this.apiUrl}/users?id=${userId}`).subscribe((users) => {
          const user = users[0];
          user.purchased = user.purchased || [];
          user.purchased.push(...movieIds.filter((id) => !(user.purchased || []).includes(id)));

          // salva sul DB
          this.http.put(`${this.apiUrl}/users/${userId}`, user).subscribe();

          // svuota il carrello
          this.http.get<Cart[]>(`${this.apiUrl}/carts?userId=${userId}`).subscribe((carts) => {
            if (carts[0]) {
              carts[0].movieIds = [];
              this.http.put(`${this.apiUrl}/carts/${carts[0].id}`, carts[0]).subscribe();
              this.cart$.next(carts[0]);
            }
          });
        });
      }),
      map(() => {})
    );
  }

  /** Observable per sottoscriversi al carrello corrente */
  cartObservable(): Observable<Cart | null> {
    return this.cart$.asObservable();
  }
}
