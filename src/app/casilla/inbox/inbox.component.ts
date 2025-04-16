import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InboxTableComponent } from '../inbox-table/inbox-table.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    InboxTableComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  

  constructor() {
    // empty constructor
  }

  ngOnInit(): void {

    /** Empty */

  }








}
