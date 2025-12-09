import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register-dialog.html',
  styleUrl: './register-dialog.scss',
})
export class RegisterDialog {
  constructor(private dialogRef: MatDialogRef<RegisterDialog>) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Register form:', form.value);
      this.dialogRef.close();
    }
  }
}
