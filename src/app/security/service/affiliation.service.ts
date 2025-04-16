import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_HEADER, AffiliationRequest, HttpGenericResponse, PersonaNaturalAfiliacion } from 'src/app/utiils/types';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage.service';



@Injectable({
  providedIn: 'root'
})
export class AffiliationService {

  constructor(private http: HttpClient, private sessionService: SessionStorageService) { }

  save(request: AffiliationRequest) {
    return this.http.post(`${environment.AFILIACION_ENDPOINT}/affiliation`, request, { withCredentials: true });
  }

  validate(request: Partial<PersonaNaturalAfiliacion>) {
    const z = APP_HEADER.HEADER_X_TOKEN_AFIL;
    let headers = new HttpHeaders();
    headers = headers.set(APP_HEADER.HEADER_X_TOKEN_AFIL, this.sessionService.getItem(APP_HEADER.HEADER_X_TOKEN_AFIL));

    return this.http.post<HttpGenericResponse>(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/validate`, request, { observe: 'response', headers });
  }

  identificacionAbogado(request: Partial<PersonaNaturalAfiliacion>) {
    let headers = new HttpHeaders();
    headers = headers.set(APP_HEADER.HEADER_X_TOKEN_AFIL, this.sessionService.getItem(APP_HEADER.HEADER_X_TOKEN_AFIL));
    return this.http.post<HttpGenericResponse>(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/abogados/identificacion`, request, { observe: 'response', headers });
  }

  sendCode(email: string, celular: string, numeroDocumento: string, token: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/sendCode`, { email, celular, numeroDocumento, token }, { observe: 'response' });
  }

  validateCode(request: Partial<PersonaNaturalAfiliacion>) {
    let headers = new HttpHeaders();
    headers = headers.set(APP_HEADER.HEADER_X_TOKEN_AFIL, this.sessionService.getItem(APP_HEADER.HEADER_X_TOKEN_AFIL));
    return this.http.post(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/validateCode`, request, { headers });

  }

  afiliarAbogado(request: Partial<PersonaNaturalAfiliacion>) {
    let headers = new HttpHeaders();
    headers = headers.set(APP_HEADER.HEADER_X_TOKEN_AFIL, this.sessionService.getItem(APP_HEADER.HEADER_X_TOKEN_AFIL));
    return this.http.post(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/abogados`, request, { headers });
  }

  initAfiliacion() {
    return this.http.post(`${environment.AFILIACION_ENDPOINT}/e/afiliacion/initForm`, {}, { observe: 'response' })
      .pipe(map(response => response.headers.get(APP_HEADER.HEADER_X_TOKEN_AFIL)))

  }


}

