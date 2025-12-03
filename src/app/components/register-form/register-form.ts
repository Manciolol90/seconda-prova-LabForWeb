import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private dialogRef: MatDialogRef<RegisterForm>,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    console.log('RegisterForm initialized');
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.accountService
        .registraUtente('http://localhost:3000/register.json', {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .subscribe((data: any) => {
          console.log('Registrazione avvenuta con successo', data);
          this.dialogRef.close();
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
