import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor(private http: HttpClient) { }


  getCaptcha(): Observable<string> {
    return this.http.get(`${environment.CASILLA_ENDPOINT}/captcha/generate`,{responseType: 'text', withCredentials: true});
  }


}
