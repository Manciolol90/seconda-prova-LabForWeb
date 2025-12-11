import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { RegisterDialog } from '../../../shared/components/register-dialog/register-dialog';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnDestroy {
  isLoggedIn = false;
  private authSub?: Subscription;

  constructor(private dialog: MatDialog, private authService: AuthService) {
    // sottoscrizione allo stato di login — protetta da undefined grazie alla correzione dell'AuthService
    this.authSub = this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  accediOnClick() {
    if (this.isLoggedIn) {
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
      } else if (result?.email && result?.password) {
        this.authService.login(result.email, result.password).subscribe({
          next: (res) => {
            console.log('Login effettuato con successo', res);
          },
          error: (err) => console.error('Login fallito', err),
        });
      }
    });
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.registeredUser) {
        console.log('Registrazione avvenuta', result.registeredUser);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
