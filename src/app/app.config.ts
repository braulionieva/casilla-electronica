
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ApplicationConfig } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './casilla/service/auth-token.interceptor';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { LOCALE_ID, importProvidersFrom, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlatformLocation } from '@angular/common';


export function HttpLoaderFactory(httpClient: HttpClient) {

  const platformLocation = inject(PlatformLocation);
  return new TranslateHttpLoader(httpClient, `${platformLocation.getBaseHrefFromDOM()}assets/i18n/`, '.json');

}

export const appConfig: ApplicationConfig = {
  providers: [
    PrimeNGConfig,
    TranslateService,
    { provide: LOCALE_ID, useValue: 'es' },
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(
      withInterceptors([authTokenInterceptor])
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideAnimations()
  ]
};
