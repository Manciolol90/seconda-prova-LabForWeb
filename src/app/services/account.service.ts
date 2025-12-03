import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {
    console.log('AccountService initialized');
  }

  registraUtente(url: string, body: {}) {
    return this.http.post(url, body);
  }
}
