import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { RegisterDialog } from '../../../shared/components/register-dialog/register-dialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    LoginDialog,
    RegisterDialog,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isLoggedIn = false;

  constructor(private dialog: MatDialog, private authService: AuthService) {
    // sottoscrizione allo stato di login
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  accediOnClick() {
    if (this.isLoggedIn) {
      // Se già loggato → logout
      this.authService.logout();
      return;
    }

    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'register') {
        this.openRegisterDialog();
      }
      if (result?.email && result?.password) {
        // login con AuthService
        this.authService.login(result.email, result.password).subscribe({
          next: () => console.log('Login effettuato con successo'),
          error: (err: any) => console.error('Login fallito', err),
        });
      }
    });
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.registeredUser) {
        // registrazione → opzionale login automatico
        console.log('Registrazione avvenuta', result.registeredUser);
      }
    });
  }
}
