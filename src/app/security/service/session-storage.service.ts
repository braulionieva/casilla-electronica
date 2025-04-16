import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { 
    //empty constructor
  }


  public setItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

}
