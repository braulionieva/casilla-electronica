import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    ButtonModule,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public ladingImage: string = "assets/images/landing-img.png"
  public ladingEnvelope: string = "assets/svg/envelope.svg"
  public appName: string = environment.APP_NAME
  public entityName: string = environment.ENTITY_NAME

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  goToLogin() {
    this.router.navigate(['/security', 'login']);
  }

}
