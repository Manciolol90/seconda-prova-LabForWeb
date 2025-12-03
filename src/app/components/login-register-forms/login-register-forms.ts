import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterForm } from '../register-form/register-form';
@Component({
  selector: 'app-login-register-forms',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RegisterForm],
  templateUrl: './login-register-forms.html',
  styleUrl: './login-register-forms.scss',
})
export class LoginRegisterForms {
  username: string = '';
  password: string = '';
  remember: boolean = true;

  constructor(private dialogRef: MatDialogRef<LoginRegisterForms>, private dialog: MatDialog) {}

  onSubmit(form: any) {
    if (form.valid) {
      this.dialogRef.close({
        username: this.username,
        password: this.password,
        remember: this.remember,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openRegister() {
    this.dialogRef.close(); // chiudo login
    this.dialog.open(RegisterForm, { width: '450px', disableClose: true });
  }
}
