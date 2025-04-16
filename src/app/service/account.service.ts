import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountRecord, LoginResponse, SidebarMenuResponse, SimpleResponse, UpdateEmailRequest, UpdatePasswordRequest, UpdateProfileRequest } from '../utiils/types';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getUserAccountData(): Observable<AccountRecord> {
    return this.http.get<AccountRecord>(`${environment.CASILLA_ENDPOINT}/account`);
  }

  updateUserData(data: AccountRecord): Observable<AccountRecord> {
    return this.http.post<AccountRecord>(`${environment.CASILLA_ENDPOINT}/account`, data);
  }

  updatePassword(rq: UpdatePasswordRequest) {
    return this.http.post<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/updatePassword`, rq);
  }

  getMenu() {
    return this.http.get<SidebarMenuResponse>(`${environment.CASILLA_ENDPOINT}/account/menu`);
  
  }

  sendEmail(email: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let body = new HttpParams().set('email', email);
    return this.http.post<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/send-email`, body.toString(), {headers});
  }

  updateEmail(request: UpdateEmailRequest) {
    return this.http.post<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/email`, request);
  }

  updateProfile(request: UpdateProfileRequest) {
    return this.http.post<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/update-profile`, request);  
  }

  changeProfile(profile: string) {
    return this.http.post<LoginResponse>(`${environment.CASILLA_ENDPOINT}/account/change`, {profile});
  }

  activate2FA(value: string) {
    return this.http.post<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/2fa`, {'activation2FA': value});
  }

  validate2FA() {
    return this.http.get<SimpleResponse>(`${environment.CASILLA_ENDPOINT}/account/2fa`);
  }

}
