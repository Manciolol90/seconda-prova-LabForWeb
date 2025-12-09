import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { RegisterDialog } from '../register-dialog/register-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  constructor(private dialogRef: MatDialogRef<LoginDialog>, private dialog: MatDialog) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Login form:', form.value);
      this.dialogRef.close();
    } else {
      console.log('Form non valido');
    }
  }

  openRegister() {
    this.dialogRef.close();
    this.dialog.open(RegisterDialog, {
      width: '400px',
      maxWidth: '90vw',
    });
  }
}
