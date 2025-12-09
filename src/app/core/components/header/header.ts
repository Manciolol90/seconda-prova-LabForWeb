import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { RegisterDialog } from '../../../shared/components/register-dialog/register-dialog';

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
  constructor(private dialog: MatDialog) {}

  accediOnClick() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'register') {
        this.openRegisterDialog();
      }
    });
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'registered') {
        console.log('Registrazione avvenuta, puoi fare redirect o login');
      }
    });
  }
}
