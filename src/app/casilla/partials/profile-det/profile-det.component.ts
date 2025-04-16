import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { AuthTokenService } from '../../service/auth-token.service';
import { UserSession, LOGIN_TYPE } from 'src/app/utiils/types';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-det',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './profile-det.component.html',
  styleUrls: ['./profile-det.component.scss']
})
export class ProfileDetComponent implements OnDestroy, OnInit {

  @ViewChild('collapsibleSection') collapsibleSection!: ElementRef<HTMLDivElement>;

  sub!: Subscription

  @Input()
  toggleProfile = false;

  userSession: UserSession | null = null;

  loginType = LOGIN_TYPE;


  @Output()
  toggleProfileChange = new EventEmitter<boolean>();

  @Output()
  onLogout = new EventEmitter<void>();


  constructor(
    private tokenService: AuthTokenService,
    private accountService: AccountService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    /** Empty  */

  }

  ngAfterViewInit(): void {
    this.sub = fromEvent(document, 'click').subscribe(t => {
      const el = t.target as HTMLElement
      const p = document.getElementById('z-det');
      let isAChild = false;
      p?.childNodes.forEach((c) => {
        if (c instanceof HTMLElement && c.contains(el)) {
          isAChild = true;
        }
      })
      if (
        el != p && !isAChild &&
        (
          el != this.collapsibleSection.nativeElement
          && !this.collapsibleSection.nativeElement.contains(el)
        )
        && this.toggleProfile
      ) {
        this.toggleProfile = !this.toggleProfile;
        this.toggleProfileChange.emit(this.toggleProfile);
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  logout($event: MouseEvent) {
    $event.preventDefault()

    this.onLogout.emit()
  }


  changeProfile(event: MouseEvent, s: string) {
    event.preventDefault();
    if (this.userSession?.session == s) {
      return ;
    }

    this.accountService.changeProfile(s).subscribe(
      {
        next: (response) => {
          this.tokenService.saveToken(response?.token);
          this.router.navigate(['/app/inbox']).then(() => {            
            window.location.reload();
          });
          
        }, 
        error: (error: HttpErrorResponse) => {

        }
      }
    )

  }


}
