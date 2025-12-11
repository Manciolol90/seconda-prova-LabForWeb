import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { RegisterDialog } from '../register-dialog/register-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface AuthResponse {
  accessToken: string;
  user: { id: number; email: string; nome: string };
}

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  constructor(
    private dialogRef: MatDialogRef<LoginDialog>,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value;

    this.authService.login(email, password).subscribe({
      next: (res: AuthResponse) => {
        console.log('Login effettuato:', res.user);
        this.dialogRef.close(res.user);
      },
      error: (err: any) => {
        console.error('Login fallito', err);
      },
    });
  }

  openRegister() {
    this.dialogRef.close();
    this.dialog.open(RegisterDialog, {
      width: '400px',
      maxWidth: '90vw',
    });
  }
}
