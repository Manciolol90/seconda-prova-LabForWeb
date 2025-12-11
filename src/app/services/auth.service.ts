import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  private token: string | null = null;
  private apiUrl = 'http://localhost:3000'; // JSON server

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.loggedIn.next(true);
    }
  }

  /** login con email e password */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.token = res?.accessToken ?? null;
        if (this.token) {
          localStorage.setItem('token', this.token);
          this.loggedIn.next(true);
        } else {
          this.loggedIn.next(false);
        }
      }),
      catchError((err) => {
        this.loggedIn.next(false);
        return of(err);
      })
    );
  }

  /** logout */
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  /** registra un nuovo utente */
  register(user: { email: string; password: string; nome: string }) {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  /** ritorna token per usarlo in header */
  getToken(): string | null {
    return this.token;
  }
}
