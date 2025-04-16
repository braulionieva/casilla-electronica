import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SecurityService } from 'src/app/security/service/security.service';
import { UserSession } from 'src/app/utiils/types';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  private jwtTokenHelper = new JwtHelperService();

  private _token = ""

  constructor(
    private storageService: StorageService, 
    private securityService: SecurityService, 
  ) { }

  get token() {
    if (this._token) {
      return this._token;
    } else if (this.storageService.getSessionToken()) {
      this._token = this.storageService.getSessionToken()!;
    }
    return this._token;
  }

  get decoded(): UserSession | null {
    return this.jwtTokenHelper.decodeToken(this._token) as UserSession;
  }
  

  saveToken(accesstoken: string): void {
    this._token = accesstoken;
    this.storageService.saveSessionToken(accesstoken);
  }

  

  logout() {
    this.storageService.clearAll();
    this.securityService.logout_().subscribe({
      next: () => {
        this._token = "";
        
        window.location.reload();
      },
      error: (err) => {      
        window.location.reload();
      }
    })
  }

  cleanClientTokenAndReload() {
    this.storageService.clearAll();
    window.location.reload();

  }

  isLoggedIn() { return !!this.token }


}
