import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent implements OnInit {

  value = ''

  ngOnInit(): void {
    /** Empty  */
  }



}
