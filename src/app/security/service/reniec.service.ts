import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IdType, PersonRespone } from 'src/app/utiils/types';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {

  constructor(private http: HttpClient) { }

  getIdTypes(): Observable<IdType[]> {
    return this.http.get<IdType[]>(`${environment.CASILLA_ENDPOINT}/reniec/idType`);
  }

  getDni(id: string, dueDate: string) {
  const params = new HttpParams().set('nro', id).set('cad', dueDate);
    return this.http.get<PersonRespone>(`${environment.CASILLA_ENDPOINT}/reniec/dni`, { params });
  }
}
  


