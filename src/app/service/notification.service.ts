import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChangeFolderRequest, NotificacionBandeja, NotificacionDetalle, SearchNotificationResponseDto } from '../utiils/types';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications() {

    return this.http.get<SearchNotificationResponseDto>(`${environment.CASILLA_ENDPOINT}/account/notification`);

  }

  getNotification(id: string) {
    return this.http.get<NotificacionDetalle>(`${environment.CASILLA_ENDPOINT}/account/notification/${id}`);
  }

  


  getNotificationsByFilter(filter: any) {

    let params = new HttpParams({fromObject: {...filter}});
    return this.http.get<SearchNotificationResponseDto>(`${environment.CASILLA_ENDPOINT}/account/notification`, {params});

  }

  changeFolder(toChang: ChangeFolderRequest) {

    return this.http.post(`${environment.CASILLA_ENDPOINT}/account/notification/folder`, toChang);
  
  }

  archivaNotificacion(toChang: ChangeFolderRequest) {

    return this.http.post(`${environment.CASILLA_ENDPOINT}/account/notification/folder/archive`, toChang);
  
  }

  downloadDocument(idDocumento: string, idNotificacion: string) {
    return this.http.get(`${environment.CASILLA_ENDPOINT}/account/notification/download/${idNotificacion}/${idDocumento}`,  {responseType: 'text'});
  }

}
