import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-regresar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './regresar.component.html',
  styleUrls: ['./regresar.component.scss']
})
export class RegresarComponent {

  @Input() redirecTo: string = ''
  @Input() text: string = ''
  
}
