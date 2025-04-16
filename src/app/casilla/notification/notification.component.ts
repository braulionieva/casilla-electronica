import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { NotificacionAdjunto, NotificacionDetalle, NotificationFolder, NotificationTag } from 'src/app/utiils/types';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthTokenService } from '../service/auth-token.service';
import { environment } from 'src/environments/environment';
import { capitalizedFirstWord } from 'src/app/utiils/funcs';
import { FLAG_STATUS } from '../../utiils/types';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { TooltipModule } from 'primeng/tooltip';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

type Recipient = { fullaname: string, id: string, inboxNumber: number };
type Document = { type: string, name: string }

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ToastModule,
    RouterLink,
    CustomToastComponent,
    TooltipModule,
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [ToastMessageService, MessageService]
})
export class NotificationComponent implements OnInit {

  notification: NotificacionDetalle | undefined;
  savingtoFolder = false;
  notif = null

  numDoc = '';
  numCasilla? = '';
  idNoficacion = '';

  appName: string = environment.APP_NAME
  entityName: string = environment.ENTITY_NAME
  logoFiscalia: string = 'assets/images/logo3.png'
  svgArchivar: string = 'assets/svg/archive.svg'
  svgDesarchivar: string = 'assets/svg/unarchive.svg'

  FLAG_STATUS = FLAG_STATUS
  
  constructor(private notificationService: NotificationService,
    private activatedRouted: ActivatedRoute,
    private toastMessageService: ToastMessageService,
    private authTokenService: AuthTokenService,
    private spiner: NgxSpinnerService,
    private renderer: Renderer2,
    private router: Router
  ) { }


  ngOnInit(): void {

  this.numCasilla = this.authTokenService.decoded?.numeroDocumento;

    this.activatedRouted.params.subscribe(params => {
      this.idNoficacion = params['id'];
       this.notificationService.getNotification(params['id']).subscribe({
        next: result => {
          this.notification = result;
         },
         error: (err: HttpErrorResponse) => {
          if (err.status == HttpStatusCode.NotFound) {
            sessionStorage.setItem('vencido', '1');
            this.router.navigate(['app/no-encontrado']);
            return ;
          } else {
            this.toastMessageService.showError("Ha ocurrrido un error al recuperar la notificación, inténtelo más tarde.");
          }
         
         }
       });
    });
  }

  print($event: MouseEvent) { $event.preventDefault(); window.print(); }

  disableArchiveButton(n: NotificacionDetalle) {
    return n.folder == NotificationFolder.ARCHIVADOS;
  }

  disableFavoriteButton(n: NotificacionDetalle) {
    return n.folder == '12' // NotificationFolder.FAVORITES;
  }

  onSingleFavorite($event: MouseEvent, n: NotificacionDetalle) {
    this.savingtoFolder = true;
    $event.preventDefault();
    const notifId: string[] = [n.idNotificacion];
    const folderValue = '12' // NotificationFolder.FAVORITES;
    this.notificationService.changeFolder({ notifId, folderValue }).subscribe({
      next: res => {
        this.savingtoFolder = false
        n.folder = '12' // NotificationFolder.FAVORITES;
        this.toastMessageService.showSuccess("La notificación ha sido archivada.");
      },
      error: err => {
        this.savingtoFolder = false
        this.toastMessageService.showError("No se pudo completar el guardado, inténtelo más tarde");
      }
    });

  }
  onSingleArchive($event: MouseEvent, n: NotificacionDetalle) {
    this.savingtoFolder = true;
    $event.preventDefault();
    const notifId: string[] = [n.idNotificacion];
    const folderValue = NotificationFolder.ARCHIVADOS;
    this.notificationService.archivaNotificacion({ notifId, folderValue }).subscribe({
      next: res => {
        this.savingtoFolder = false;
        n.archivado =  n.archivado == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
        if (n.archivado == FLAG_STATUS.ACTIVO) {
          this.toastMessageService.showSuccess(`Se archivó la notificación.`);
        } else {
          this.toastMessageService.showSuccess(`Se desarchivó la notificación.`);          
        }

      },
      error: err => {
        this.savingtoFolder = false
        this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde");
      }
    });
  }

  // ngAfterViewInit(): void {

  //   setTimeout(() => {
  //     const elm = document.getElementById('det-profile-data')
  //     this.numCasilla = elm?.dataset?.['numcasilla'] ?? ''
  //     this.numDoc = elm?.dataset?.['numdoc'] ?? ''
  //   }, 999)

  // }
  historyBack(evt: MouseEvent) {
    evt.preventDefault();
    window.history.back();
  }

  descargar(e: MouseEvent, notificacionAdjunto: NotificacionAdjunto) {
    e.preventDefault();
    this.spiner.show();
    this.notificationService.downloadDocument(notificacionAdjunto.idDocumento, this.idNoficacion).subscribe({
      next: res => {
        this.spiner.hide();
        const base64 = res
       
        const byteString = atob(base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'application/octet-stream' }); 

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = notificacionAdjunto.noDocumentoOrigen; 
      link.click();

      window.URL.revokeObjectURL(url);
      },
      error: err => {
        this.spiner.hide();
        this.toastMessageService.showError("No se pudo completar la descarga, inténtelo más tarde");
      }
    });
  }

  esCitacion(n: NotificacionDetalle) {
    return n.tipoCedula == NotificationTag.CITACION;
  }

  capitalizedFirstWord(value: string){
    return capitalizedFirstWord(value)
  }

  removeComma(value: string){
    return value.replaceAll(',','')
  }
  
}
