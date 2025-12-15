import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './search-dialog.html',
  styleUrls: ['./search-dialog.scss'],
})
export class SearchDialog {
  termine: string = '';

  @Output() termineChange = new EventEmitter<string>();

  constructor(private dialogRef: MatDialogRef<SearchDialog>) {}

  /** Trigger on every input letter */
  onInput() {
    this.termineChange.emit(this.termine.toLowerCase());
  }

  /** Chiude il dialog */
  chiudi() {
    if (!this.termine) {
      this.termineChange.emit('');
    }
    this.dialogRef.close();
  }
}
