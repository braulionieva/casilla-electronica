import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminosCondicionesService {

  constructor(private http: HttpClient) { }

  getTerminosCondiciones(){
    return this.http.get(`${environment.AFILIACION_ENDPOINT}/e/terminoscondiciones`, {responseType: 'text'});
  }

}
