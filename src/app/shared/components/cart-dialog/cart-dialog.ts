import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../models/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './cart-dialog.html',
  styleUrls: ['./cart-dialog.scss'],
})
export class CartDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movies: Movie[] },
    private dialogRef: MatDialogRef<CartDialog>
  ) {}

  onPurchase() {
    this.dialogRef.close('purchase');
  }
}
