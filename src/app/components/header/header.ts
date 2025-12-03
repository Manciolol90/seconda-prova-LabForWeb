import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoginRegisterForms } from '../login-register-forms/login-register-forms';

@Component({
  selector: 'app-header',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private dialog: MatDialog) {}

  accediOnClick() {
    const dialogRef = this.dialog.open(LoginRegisterForms, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        console.log('Dati login:', data);
      } else {
        console.log('Login annullato');
      }
    });
  }
}
