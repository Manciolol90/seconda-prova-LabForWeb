import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface RegisterUser {
  id?: number;
  nome: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './register-dialog.html',
  styleUrl: './register-dialog.scss',
})
export class RegisterDialog {
  constructor(private dialogRef: MatDialogRef<RegisterDialog>, private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { name, email, password } = form.value;
    const user: RegisterUser = { nome: name, email, password };

    this.authService.register(user).subscribe({
      next: (registeredUser: RegisterUser) => {
        console.log('Registrazione avvenuta:', registeredUser);
        this.dialogRef.close({ registeredUser });
      },
      error: (err: any) => {
        console.error('Registrazione fallita', err);
      },
    });
  }
}
