import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { SearchNotificationResponseDto } from 'src/app/utiils/types';
import { InboxTableComponent } from '../inbox-table/inbox-table.component';

@Component({
  selector: 'app-inbox-tag',
  standalone: true,
  imports: [
    CommonModule,
    InboxTableComponent
  ],
  templateUrl: './inbox-tag.component.html',
  styleUrls: ['./inbox-tag.component.scss']
})
export class InboxTagComponent implements OnInit {

  notification$: Observable<SearchNotificationResponseDto> | undefined;
  tag: string | null = null;

  constructor(private activatedRouted: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit() {

    this.activatedRouted.params.subscribe(params => {
      this.tag = params['id'];
   });

  }

} 


