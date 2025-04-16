import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, from, map, of } from 'rxjs';
import { ListItemResponse } from 'src/app/utiils/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {

  constructor(private http: HttpClient) { }


  tiposDeDocumento(): Observable<ListItemResponse[]> {
    return this.http.get<any>(`${environment.MAESTROS_ENDPOINT}/v1/cftm/e/tipodocidentidad`).pipe(
      map(data => (data.data) as ListItemResponse[]),
      map(i => i.filter(z => z.id == 1))
    );
  }

  colegioDeAbogados(): Observable<ListItemResponse[]> {
    return this.http.get<any>(`${environment.MAESTROS_ENDPOINT}/v1/cftm/e/colegioabogados`)
      .pipe(map(data => data.data));
  }




}
