import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SmsGenerateCodeRequest } from 'src/app/utiils/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SMSService {

  constructor(private http: HttpClient) { }

  sendSMS(rq: SmsGenerateCodeRequest) {

    return this.http.post(`${environment.CASILLA_ENDPOINT}/sms/code`, rq, { withCredentials: true});

  }

  validateCode(rq: SmsGenerateCodeRequest) {

    const params = new HttpParams()
      .set('code', rq.code)
      .set('cellphone', rq.cellphone);;

    return this.http.get(`${environment.CASILLA_ENDPOINT}/sms/code`, {params});
  }

}
