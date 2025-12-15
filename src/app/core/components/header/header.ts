import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { RegisterDialog } from '../../../shared/components/register-dialog/register-dialog';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchDialog } from '../../../shared/components/search-dialog/search-dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnDestroy {
  isLoggedIn = false;
  private authSub?: Subscription;
  termine: string = '';
  searchCardOpen = false;
  userName: string | null = null;

  @Output() cerca = new EventEmitter<string>();

  onKeyPress() {
    this.cerca.emit(this.termine.toLowerCase());
  }

  resetRicerca() {
    this.termine = '';
    this.cerca.emit('');
  }

  constructor(private dialog: MatDialog, private authService: AuthService) {
    // sottoscrizione allo stato di login — protetta da undefined grazie alla correzione dell'AuthService
    this.authSub = this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  accediOnClick() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user === 'register') {
        this.openRegisterDialog();
      } else if (user?.email) {
        this.userName = user.nome;
        this.isLoggedIn = true;
        console.log('Login riuscito, utente:', user);
      }
    });
  }

  logoutOnClick() {
    this.authService.logout();
    this.userName = null;
    this.isLoggedIn = false;
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.registeredUser) {
        console.log('Registrazione avvenuta', result.registeredUser);
      }
    });
  }

  closeSearchCard() {
    this.searchCardOpen = false;
    this.termine = '';
    this.cerca.emit('');
  }

  openSearchCard() {
    const dialogRef = this.dialog.open(SearchDialog, {
      width: '400px',
    });

    const instance = dialogRef.componentInstance;
    instance.termineChange.subscribe((termine: string) => {
      this.termine = termine;
      this.cerca.emit(termine);
    });
  }

  topleft() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
