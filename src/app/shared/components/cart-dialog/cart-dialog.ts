import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';

interface CartDialogData {
  movies: Movie[];
  onRemove?: (movieId: number) => void;
}

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './cart-dialog.html',
  styleUrls: ['./cart-dialog.scss'],
})
export class CartDialog {
  movies: Movie[] = [];
  private sub?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CartDialogData,
    private dialogRef: MatDialogRef<CartDialog>,
    private cartService: CartService
  ) {
    this.movies = [...data.movies];

    this.sub = this.cartService.getCartObservable().subscribe((cart) => {
      if (!cart) return;
      this.movies = this.movies.filter((m) => cart.movieIds.includes(m.id));
    });
  }

  onPurchase() {
    this.dialogRef.close('purchase');
  }

  removeMovie(movieId: number) {
    if (this.data.onRemove) {
      this.data.onRemove(movieId);
    }
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
