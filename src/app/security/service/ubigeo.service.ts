import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UbigeoRespone } from 'src/app/utiils/types';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(private http: HttpClient) { }

  departamentos() {
    return this.http.get<UbigeoRespone[]>(`${environment.AFILIACION_ENDPOINT}/ubigeo/departamento`);

  }

  provsByDeps(depId: string) {

    return this.http.get<UbigeoRespone[]>(`${environment.AFILIACION_ENDPOINT}/ubigeo/departamento/${depId}/provincia`)

  }

  distByProvs(depId: string, distId: string) {
    return this.http.get<UbigeoRespone[]>(`${environment.AFILIACION_ENDPOINT}/ubigeo/departamento/${depId}/provincia/${distId}/distrito`)
  }



}
