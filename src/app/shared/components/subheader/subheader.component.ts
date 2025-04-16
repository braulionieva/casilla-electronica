import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subheader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent {

  @Input() 
  title = ''

  @Input()
  subtitle? = ''

  @Input()
  narrow: boolean = false

}
