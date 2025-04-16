import { Injectable } from '@angular/core';
declare let gtag: Function;
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { 
    //empty constructor
     }

  public trackEvent(eventName: string, params: any): void {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }
}
