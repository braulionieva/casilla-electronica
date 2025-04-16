import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly TOKEN_KEY = 'd9zga';
  private readonly FIRST_TOKEN_KEY = 'd9zgaX12';

  constructor() {
    //empty constructor
  
   }

  saveFirstToken(token: string) {
    localStorage.setItem(this.FIRST_TOKEN_KEY, token);  
  }

  getFirstToken(): string | null {
    return localStorage.getItem(this.FIRST_TOKEN_KEY);
  }

  clearFirstToken() {
    localStorage.removeItem(this.FIRST_TOKEN_KEY);
  }

  saveSessionToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  clearSessionToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getSessionToken(): string   | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  

  clearAll() {
    localStorage.clear();
  }
}
