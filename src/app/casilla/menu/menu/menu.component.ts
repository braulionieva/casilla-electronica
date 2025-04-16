import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarMenu, SidebarMenuResponse } from 'src/app/utiils/types';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { ProfileDetComponent } from '../../partials/profile-det/profile-det.component';
import { AuthTokenService } from '../../service/auth-token.service';
import { AccordionModule } from 'primeng/accordion';
import { MenuUserComponent } from '../menu-user/menu-user.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent,
    ProfileDetComponent,
    AccordionModule,
    MenuUserComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  menu: SidebarMenuResponse | null = null;
  @Output() closeSideBar = new EventEmitter<boolean>()

  menuGroup: SidebarMenu[] = [];

  toggleProfile: boolean = false

  constructor(
    private tokenService: AuthTokenService,
  ) { }

  ngOnInit(): void {

    const folders = this.menu?.folders.map((folder, i) => {      
      if (i>0) {
        folder.url = `/app/notification/folder/${folder.id}`;
      } else {
        folder.url = `/app/inbox`;
      }
      return folder;
    });

    const tags = this.menu?.tags.map(folder => {
      folder.url = `/app/notification/tag/${folder.id}`;
      return folder;
    });

    this.menuGroup = [
      { name: 'Mis carpetas', items: folders ?? [], id: "0", url: '', icon: 'assets/svg/folder.svg' },
      { name: 'Mis etiquetas', items: tags ?? [], id: "1", url: '', icon: 'assets/svg/label.svg' },
      { name: 'Actualizar datos', items: [], id: "2", url: 'app/my-account', icon: 'assets/svg/edit.svg' }
    ]

  }

  toggleProfileDet(evt: MouseEvent) {
    evt.preventDefault();
    this.toggleProfile = !this.toggleProfile
  }

  logout() {
    this.tokenService.logout()
  }

  onCloseSideBar(value: boolean) {
    this.closeSideBar.emit(value)
  }
  
}




