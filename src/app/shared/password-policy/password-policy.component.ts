import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-password-policy',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.scss']
})
export class PasswordPolicyComponent {

}
