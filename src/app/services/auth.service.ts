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
  private userId: number | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.loggedIn.next(true);
    }
  }

  login(email: string, password: string): Observable<LoginResponse | any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        console.log("prima dell'if", res);
        if (res?.accessToken) {
          console.log('Login avvenuto con successo:', res);
          this.token = res.accessToken;
          console.log('TOKEN SALVATO:', this.token);
          localStorage.setItem('token', this.token);

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

  register(user: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    console.log('questa è get token TOKEN', this.token);
    return this.token;
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }
}
