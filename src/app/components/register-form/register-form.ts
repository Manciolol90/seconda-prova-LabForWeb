import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private dialogRef: MatDialogRef<RegisterForm>) {}

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Registrazione:', {
        username: this.username,
        email: this.email,
        password: this.password,
      });
      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
