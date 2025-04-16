import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NgxSpinnerModule,
    ToastModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppComponent {


  title = 'casilla-web';
  subscription: Subscription | null = null;
  constructor(
    private primeNGConfig: PrimeNGConfig,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
    this.subscription = this.translateService
      .stream('primeng')
      .subscribe((data) => {
        this.primeNGConfig.setTranslation(data);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isRouteActive(routePrefix: string): boolean {
    return this.router.url.startsWith(routePrefix);
  }
}
