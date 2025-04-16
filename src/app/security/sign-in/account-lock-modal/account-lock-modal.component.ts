import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-account-lock-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-lock-modal.component.html',
  styleUrls: ['./account-lock-modal.component.scss']
})
export class AccountLockModalComponent {

  constructor(private readonly ref: DynamicDialogRef) {}

  closeModal() {
    this.ref.close()
  }

}