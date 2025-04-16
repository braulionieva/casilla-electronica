import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CodeValidationRequest, HttpGenericResponse, LoginResponse, SmsGenerateCodeResponse, UpdatePasswordRequest } from 'src/app/utiils/types';
import { PasswordCryptService } from './password-crypt.service';
import { from, lastValueFrom, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient, private pwService: PasswordCryptService) { }

  login(dniAndPassword: any) {
    return this.http.post<LoginResponse>(`${environment.CASILLA_ENDPOINT}/auth/login`, dniAndPassword, { observe: 'response' });
  }



  getbyDni(dni: string) {
    return this.http.post(`${environment.CASILLA_ENDPOINT}/auth/sendCode`, dni);
  }

  validateCode(rq: CodeValidationRequest) {
    return this.http.post<SmsGenerateCodeResponse>(`${environment.CASILLA_ENDPOINT}/auth/validateCode`, rq, { withCredentials: true });
  }

  logout_() {
    return this.http.post(`${environment.CASILLA_ENDPOINT}/account/logout`, {});

  }

  // resetPassword(rq: UpdatePasswordRequest) {
  //   return this.http.post(`${environment.CASILLA_ENDPOINT}/auth/resetPassword`, rq, { withCredentials: true });

  // }

  changePassword(rq: UpdatePasswordRequest) {

    const headers = new HttpHeaders()
      .append('Authorization', `Bearer ${rq.token}`);

    return this.http.post(`${environment.CASILLA_ENDPOINT}/auth/updatePassword`, rq, { headers, withCredentials: true});
  }


  forgorPassword(user: string,token: string) {
    return this.http.post<HttpGenericResponse>(`${environment.CASILLA_ENDPOINT}/auth/forgot-password`, {user, token});
  }

  resetPassword(rq: UpdatePasswordRequest) {
    return this.http.post<HttpGenericResponse>(`${environment.CASILLA_ENDPOINT}/auth/reset-password`, rq);
  }

  validateToken(token: string, uid: string) {
    return this.http.post<HttpGenericResponse>(`${environment.CASILLA_ENDPOINT}/auth/check-application`, {token, uid});
  }

  ValidateSecurityResponse(tipo:string,respuesta: string,numeroDocumento:string) {
    return this.http.get<boolean>(`${environment.CASILLA_ENDPOINT}/auth/validate-security-response/${tipo}/${respuesta}/${numeroDocumento}`);
  }


  resentCode2FA(data: any) {
    return this.http.post(`${environment.CASILLA_ENDPOINT}/auth/resent-code`, data)
  }

}
