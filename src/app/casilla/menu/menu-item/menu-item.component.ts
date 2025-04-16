import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarMenu } from 'src/app/utiils/types';
import { AccordionModule } from 'primeng/accordion';
@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AccordionModule,
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: '*', visibility: '' })),
      state('false', style({ height: '0px', visibility: 'hidden' })),
      transition('false <=> true', animate(500))
    ])
  ],
})
export class MenuItemComponent implements OnInit {

  @ViewChild('collapsibleSection') collapsibleSection!: ElementRef<HTMLDivElement>;

  @Input() header = ''
  @Input() icon = ''
  @Input() item!: SidebarMenu
  @Input() active = false;
  @Output() closeSideBar = new EventEmitter<boolean>()

  show = false;

  constructor(private router: Router){}

  async clickMe() {
    if (this.item.items.length == 0) {
      this.checkIfCloseSideBar()
      await this.router.navigate(['app', 'my-account']);
      return
    }

    this.toggle()
  }

  toggle() { this.show = !this.show; }

  ngOnInit(): void { this.show = this.active }

  getIcon( name: string ): string {
    return {
      'Recibidos': 'assets/svg/received.svg',
      'Destacados': 'assets/svg/star.svg',
      'Importantes': 'assets/svg/important.svg',
      'Leídos': 'assets/svg/read.svg',
      'Archivados': 'assets/svg/archives.svg',
      'Citaciones': 'assets/svg/citations.svg',
      'Notificaciones': 'assets/svg/notifications.svg'
    }[ name ] || ''
  }

  checkIfCloseSideBar(){
    const width: number = window.innerWidth
    if ( width <= 1060 ) {
      this.closeSideBar.emit(true)
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route && this.item.items.length == 0;
  }

}
