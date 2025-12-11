import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private dbUrl = 'http://localhost:3000'; // JSON Server con json-server-auth

  constructor(private http: HttpClient) {
    // Se c'è già un token → consideriamo l'utente loggato
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn.next(true);
    }
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  /** Login reale con JSON Server Auth */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.dbUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.accessToken); // salva JWT
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  /** Registrazione */
  register(email: string, password: string, nome: string): Observable<any> {
    return this.http.post(`${this.dbUrl}/register`, { email, password, nome });
  }
}
