import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentYear!: number
  public entityName: string = environment.ENTITY_NAME
  public version: string = environment.VERSION
  
  constructor() {
    this.currentYear = new Date().getFullYear();
  }

}
