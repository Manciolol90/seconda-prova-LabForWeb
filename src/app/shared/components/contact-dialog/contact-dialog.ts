import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dialog.html',
  styleUrls: ['./contact-dialog.scss'],
})
export class ContactDialog {
  @Output() close = new EventEmitter<void>();

  send(form: NgForm) {
    if (form.invalid) return;

    const { nome, email, messaggio } = form.value;
    console.log('Contatto inviato:', nome, email, messaggio);

    form.resetForm();
    this.close.emit();
  }

  closeDialog() {
    this.close.emit();
  }
}
