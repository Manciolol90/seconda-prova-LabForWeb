import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

interface RegisterUser {
  email: string;
  password: string;
  nome: string;
}

interface LoginResponse {
  accessToken: string;
  user: { email: string; nome: string; id: number };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  private token: string | null = null;
  private userId: number | null = null; // <- aggiunto
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.loggedIn.next(true);
    }
  }

  /** LOGIN con email e password */
  login(email: string, password: string): Observable<LoginResponse | any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res?.accessToken) {
          this.token = res.accessToken;
          localStorage.setItem('token', this.token);

          // <-- SALVA l'utente loggato
          localStorage.setItem('user', JSON.stringify(res.user));

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

  /** REGISTRAZIONE nuovo utente */
  register(user: RegisterUser): Observable<any> {
    // json-server-auth gestisce automaticamente password hashata
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  /** LOGOUT */
  logout() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  /** RITORNA il token JWT per le chiamate protette */
  getToken(): string | null {
    console.log('TOKEN', this.token);
    return this.token;
  }

  /** Ritorna l’ID dell’utente loggato */
  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }
}
