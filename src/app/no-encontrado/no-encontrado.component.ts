import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-no-encontrado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './no-encontrado.component.html',
  styleUrls: ['./no-encontrado.component.scss']
})
export class NoEncontradoComponent {

  public svgNotFound: string = 'assets/svg/not-found.svg';
  public redirectUrl: string = ''
  public className: string = ''
  private vencido: boolean = false

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const vencido = sessionStorage.getItem('vencido')
    if (vencido) {
      this.vencido = true
      sessionStorage.removeItem('vencido')
    }
    this.route.data.subscribe(data => {
      this.redirectUrl = data['redirect'];
      this.className = data['className'] || '';
    });
  }

  regresar() {
    if ( this.vencido ) {
      this.irPaginaPrincipal()
      return
    }
    this.location.back();
    setTimeout(() => {
      this.location.back();
    }, 100);
  }

  irPaginaPrincipal() {
      this.router.navigate([this.redirectUrl]);
  }

}
