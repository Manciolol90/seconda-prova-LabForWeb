// src/app/shared/components/cart-dialog/cart-dialog.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './cart-dialog.html',
  styleUrls: ['./cart-dialog.scss'],
})
export class CartDialog {
  @Input() movies: Movie[] = [];

  // Callback per il pulsante acquista
  onPurchase() {
    // Eventuale logica di acquisto verrà gestita dal chiamante
  }
}
