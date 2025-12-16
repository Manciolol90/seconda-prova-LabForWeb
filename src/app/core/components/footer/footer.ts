import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactDialog } from '../../../shared/components/contact-dialog/contact-dialog';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactDialog],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  contactOpen = false;

  openContact() {
    this.contactOpen = true;
  }

  closeContact() {
    this.contactOpen = false;
  }

  send(form: any) {
    if (form.valid) {
      this.closeContact();
      form.reset();
    }
  }
}
