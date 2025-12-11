import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Stato login globale
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor() {}

  /** Observable pubblico per sapere se l'utente è loggato */
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /** Login manuale (simulato) */
  login() {
    this.loggedIn.next(true);
  }

  /** Logout */
  logout() {
    this.loggedIn.next(false);
  }

  /** Ritorna lo stato attuale (true/false) */
  get isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
