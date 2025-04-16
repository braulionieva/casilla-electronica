import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastMessageService } from 'src/app/service/toast-message.service';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { obtenerMensajeVacio } from 'src/app/shared/constants/inbox-empty';
import { capitalized, capitalizedFirstWord } from 'src/app/utiils/funcs';
import { NumeroCasoComponent } from 'src/app/utiils/numero-caso/numero-caso.component';
import { DOBLE_PERFIL, FLAG_STATUS, NotificacionBandeja, NotificationFolder, NotificationStatus, NotificationTag, SearchNotificationResponseDto, TIPO_PERSONA } from 'src/app/utiils/types';
import { AuthTokenService } from '../service/auth-token.service';

@Component({
  selector: 'app-inbox-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TagModule,
    TableModule,
    ToastModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    NumeroCasoComponent,
    CustomToastComponent
  ],
  templateUrl: './inbox-table.component.html',
  styleUrls: ['./inbox-table.component.scss'],
  animations: [
    trigger('hideShow', [
      state('false', style({ opacity: 0, visibility: 'hidden' })),
      state('true', style({ opacity: 1, visibility: 'visible' })),
      transition('false <=> true', animate(300))
    ])
  ],
  providers: [ToastMessageService, MessageService]
})
export class InboxTableComponent implements OnInit, OnDestroy {

  FLAG_STATUS = FLAG_STATUS;


  folder: string | null = null;
  tag: string | null = null;

  d = new Date();

  notificationResponse: SearchNotificationResponseDto = {
    notifications: [],
    total: 0,
    size: 0
  };
  notifications: NotificacionBandeja[] = [];
  inboxTitle = 'Recibidos';
  selectedItems: NotificacionBandeja[] = [];
  savingtoFolder = false;
  hideTableTemp = false
  lastPageSearched: number = 1

  subs = new Subscription();


  form = this.fb.group({
    tramite: '',
    caseNumber: '',
    notificationNumber: '',
    proceduralAct: '',
    notificationDate: '',
    folder: '',
    tag: '',
  })

  empty: any = null;
  loadinInbox = false;
  svgArchivar: string = 'assets/svg/archive.svg'
  svgMore: string = 'assets/svg/more.svg'
  svgViewFile: string = 'assets/svg/view-file.svg'
  rowRightLong: string = 'assets/svg/row-right-long.svg'
  svgUnarchivar: string = 'assets/svg/unarchive.svg'

  routeSubscription: Subscription | undefined;

  firstLoaded: boolean = false
  secondLoaded: boolean = false

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private toastMessageService: ToastMessageService,
    private authService: AuthTokenService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.tag = null
      this.folder = null
      this.firstLoaded = false
      this.secondLoaded = false
      this.lastPageSearched = 1;
      this.selectedItems = [];
      this.form.patchValue({
        folder: '',
        tag: '',
        tramite: ''
      })
      const type = params['type'];
      const id = params['id'];
      if (type === 'folder') {
        this.folder = id;
        this.form.get('folder')?.setValue(id);
      }
      if (type === 'tag') {
        this.tag = id;
        this.form.get('tag')?.setValue(id);
      }
      this.getTitle()
      this.notificationResponse = {
        notifications: [],
        total: 0,
        size: 0
      }
      this.loadNotifications()
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.subs.unsubscribe();
  }

  getTipoCedula(tipo: string) {
    return NotificationTag.CITACION == tipo ? 'Citación' : 'Notificación';
  }


  esArchivado(archivado: string) {
    return '1' == archivado;
  }


  isNotificationRead(status: string): boolean {
    return status == NotificationStatus.READ.toString();
  }

  isNotificationReceived(status: string): boolean {
    return status == NotificationStatus.RECEIVED.toString();
  }

  private handleLazyLoading(isLazy: boolean, lazyId: number): boolean {
    if (isLazy) {
      if (lazyId === 1 && !this.firstLoaded) {
        this.firstLoaded = true;
        return true;
      }
      if (lazyId === 2 && !this.secondLoaded) {
        this.secondLoaded = true;
        return true;
      }
    }
    return false;
  }

  loadNotifications($event: any = null, isLazy: boolean = false, lazyId: number = 0, quantity: number = 1, isSearch: boolean = false ) {

    if (this.handleLazyLoading(isLazy, lazyId)) return;
    let pageNumber = 1;
    if ($event) {
      pageNumber = (($event.first / $event.rows) + 1);
      if (!isFinite(pageNumber)) {
        pageNumber = 1;
      }
    }

    if ($event ===  null) {
      pageNumber = 1
      if ( !isSearch ) {
        const newTotalNotifations = this.notificationResponse.total - quantity
        const perPage: number = 10
        pageNumber = Math.ceil(newTotalNotifations / perPage)
        if ( this.lastPageSearched <= pageNumber ) {
          pageNumber = this.lastPageSearched
        }
      }
      if ( isSearch ) {
        this.hideTableTemp = true
      }
    }

    const { notificationDate, ...s } = this.form.value;
    const i = notificationDate ?? [null, null]
    const p: any = {
      ...s, createdAtStart: (i[0]), createdAtEnd: (i[1]), pageNumber
    }
    Object.keys(p).forEach((key) => {
      if (!p[key] || p[key] == '') {
        delete p[key];
      }
    });
    this.loadinInbox = true;
    this.lastPageSearched = pageNumber
    this.subs.add(
      this.notificationService.getNotificationsByFilter(p).subscribe(
        {
          next: res => {
            this.loadinInbox = false
            this.notificationResponse = { ...res };
            this.notificationResponse.notifications = [ ...res.notifications ];
            this.notifications = { ...res.notifications };
            this.hideTableTemp = false
          },
          error: err => {
            this.toastMessageService.showError(`Ha ocurrrido un error al recuperar las notificaciones, inténtelo más tarde.`)
            this.loadinInbox = false
            this.hideTableTemp = false
          }
        }
      )
    );
  }

  getTitle(): void {
    if (this.folder) {
      switch (this.folder) {
        case NotificationFolder.LEIDOS: this.inboxTitle = 'Leídos'; break;
        case NotificationFolder.DESTACADOS: this.inboxTitle = 'Destacados'; break;
        case NotificationFolder.IMPORTANTES: this.inboxTitle = 'Importantes'; break;
        case NotificationFolder.ARCHIVADOS: this.inboxTitle = 'Archivados'; break;
      }
    }
    if (this.tag) {
      switch (this.tag) {
        case NotificationTag.CITACION: this.inboxTitle = 'Citaciones'; break;
        case NotificationTag.NOTIFICACION: this.inboxTitle = 'Notificaciones'; break;
      }
    }
    this.empty = obtenerMensajeVacio(this.inboxTitle);
  }


  get isArchivedFolder() {
    return this.folder === NotificationFolder.ARCHIVADOS
  }


  onArchive($event: MouseEvent) {
    this.savingtoFolder = true;
    this.spinner.show()
    $event.preventDefault();
    const notifId = this.selectedItems.map(x => x.idNotificacion);
    const quantity = this.selectedItems.length
    if (notifId.length == 0) {
      this.savingtoFolder = false;
      this.spinner.hide();
      this.toastMessageService.showWarn("Nada que actualizar");
      return;
    }
    const folderValue = NotificationFolder.ARCHIVADOS;
    let archivados = FLAG_STATUS.ACTIVO;
    this.subs.add(
      this.notificationService.archivaNotificacion({ notifId, folderValue }).subscribe({
        next: res => {
          this.spinner.hide()
          this.savingtoFolder = false
          this.selectedItems = []
          this.notificationResponse.notifications = this.notificationResponse.notifications.map(x => {
            if (notifId.includes(x.idNotificacion)) {
              x.archivado = x.archivado == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
              archivados = x.archivado;
            }
            return x;
          });
          
          const singular = notifId.length == 1;
          if (archivados == FLAG_STATUS.ACTIVO) {
            this.toastMessageService.showSuccess(`Se ${singular?'archivó': 'archivaron'} ${singular?'la':notifId.length} ${singular?'notificación': 'notificaciones'}.`);
          } else {
            this.toastMessageService.showSuccess(`Se ${singular ? 'desarchivó' : 'desarchivaron'} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'}.`);          
          }

          this.loadNotifications(null, false, 0, quantity);
        },
        error: err => {
          this.spinner.hide()
          this.savingtoFolder = false
          this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde");
        }
      })
    )
  }
  
  onSingleImportant($event: MouseEvent, n: NotificacionBandeja) {
    $event.preventDefault();
    this.savingtoFolder = true;
    const notifId: string[] = [n.idNotificacion];
    const folderValue = NotificationFolder.IMPORTANTES;
    let importantes = FLAG_STATUS.ACTIVO;
    this.spinner.show();
    this.subs.add(
      this.notificationService.changeFolder({ notifId, folderValue }).subscribe({
        next: res => {
          this.spinner.hide();
          this.savingtoFolder = false
         
          this.notificationResponse.notifications = this.notificationResponse.notifications.map(x => {
            if (notifId.includes(x.idNotificacion)) {
              x.importante = x.importante == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
              importantes = x.importante;
            }
            return x;
          });
          if (this.folder == NotificationFolder.IMPORTANTES)
            this.loadNotifications();

          const singular = notifId.length == 1;
          if (importantes == FLAG_STATUS.ACTIVO) {
            this.toastMessageService.showSuccess(`Se ${singular?'marcó': 'marcaron'} ${singular?'la':notifId.length} ${singular?'notificación': 'notificaciones'} como importante${singular?'':'s'}.`);
          } else {
            this.toastMessageService.showSuccess(`Se ${singular ? 'marcó' : 'marcaron'} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'} como no importante${singular?'':'s'}.`);          
          }
        },
        error: err => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.toastMessageService.showError("No se pudo completar el guardado, inténtelo más tarde.");
        }
      })
    );
  }

  

  onSingleOutstanding($event: MouseEvent, n: NotificacionBandeja) {
    $event.preventDefault();

    this.savingtoFolder = true;
    this.spinner.show();
    const notifId: string[] = [n.idNotificacion];
    const folderValue = NotificationFolder.DESTACADOS;
    //let destacados = FLAG_STATUS.ACTIVO;
    this.subs.add(
      this.notificationService.changeFolder({ notifId, folderValue }).subscribe({
        next: res => {
          this.savingtoFolder = false;
          this.spinner.hide();
          this.notificationResponse.notifications = this.notificationResponse.notifications.map(x => {
            if (notifId.includes(x.idNotificacion)) {              
              x.destacado = x.destacado == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
             // destacados = x.destacado;
            }
            return x;
          });

          if (this.folder == NotificationFolder.DESTACADOS)
            this.loadNotifications();
          //const singular = notifId.length == 1;
    //      if (destacados == FLAG_STATUS.ACTIVO) {
    //        this.toastMessageService.showSuccess(`Se ${singular?'marcó': 'marcaron'} ${singular?'la':notifId.length} ${singular?'notificación': 'notificaciones'} como destacado${singular?'':'s'}.`);
    //      } else {
    //        this.toastMessageService.showSuccess(`Se ${singular ? 'marcó' : 'marcaron'} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'} como no destacado${singular?'':'s'}.`);          
    //      }

        },
        error: err => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde.");
        }
      })
    );
  }

  onSingleUnArchive($event: MouseEvent, n: NotificacionBandeja) {
    $event.preventDefault();
    this.savingtoFolder = true;
    this.spinner.show();
    const notifId: string[] = [n.idNotificacion];
    const folderValue = NotificationFolder.ARCHIVADOS;
    this.subs.add(
      this.notificationService.archivaNotificacion({ notifId, folderValue }).subscribe({
        next: res => {
          this.savingtoFolder = false;
          this.spinner.hide();
          this.loadNotifications();

          const singular = notifId.length == 1;
          this.toastMessageService.showSuccess(`Se ${singular ? 'desarchivó' : 'desarchivaron'} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'}.`);          
        },
        error: err => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde");
        }
      }))
    }

  get isAllImportant() {
    return this.notificationResponse.notifications.every(x => x.importante == FLAG_STATUS.ACTIVO);
  }

  get isAllOutstanding() {
    return this.notificationResponse.notifications.every(x => x.destacado == FLAG_STATUS.ACTIVO);
  }

  onOutstanding($event: MouseEvent) {
    this.savingtoFolder = true
    $event.preventDefault();
    this.spinner.show();
    let notifId: string[] = [];
    let destacados = FLAG_STATUS.ACTIVO;
    if (this.isAllOutstanding) {
      
      notifId = this.notificationResponse.notifications.map(n => n.idNotificacion);
    } else {
      notifId = this.notificationResponse.notifications.filter(x => x.destacado == FLAG_STATUS.INACTIVO).map(x => x.idNotificacion);
    }

    if (notifId.length == 0) {
      this.savingtoFolder = false
      this.toastMessageService.showWarn("Nada que actualizar");
      return;
    }
    const quantity = notifId.length
    const folderValue = NotificationFolder.DESTACADOS;
    this.subs.add(
      this.notificationService.changeFolder({ notifId, folderValue }).subscribe({
        next: res => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.notificationResponse.notifications = this.notificationResponse.notifications.map(x => {
            if (notifId.includes(x.idNotificacion)) {
              destacados =  x.destacado == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
              x.destacado = x.destacado == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
            }
            return x;
          });

          if (this.folder == NotificationFolder.DESTACADOS)
            this.loadNotifications(null, false, 0, quantity);

          const singular = notifId.length == 1;
          if (destacados == FLAG_STATUS.ACTIVO) {
            this.toastMessageService.showSuccess(`Se ${singular?'destacó': 'destacaron'} ${singular?'la':notifId.length} ${singular?'notificación': 'notificaciones'}.`);
          } else {
            this.toastMessageService.showSuccess(`Se ${singular ? 'dejó de destacar' : 'dejaron de destacar '} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'}.`);          
          }
        },
        error: err => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde.");

        }
      })
    );

  }

  onImportant($event: MouseEvent) {
    this.savingtoFolder = true
    $event.preventDefault();
    this.spinner.show();
    let notifId: string[] = [];
    if (this.isAllImportant) {
      notifId = this.notificationResponse.notifications.map(n => n.idNotificacion);
    } else {
      notifId = this.notificationResponse.notifications.filter(x => x.importante == FLAG_STATUS.INACTIVO).map(x => x.idNotificacion);
    }
    if (notifId.length == 0) {
      this.savingtoFolder = false
      this.toastMessageService.showWarn("Nada que actualizar");
      return;
    }
    const quantity = notifId.length
    const folderValue = NotificationFolder.IMPORTANTES;
    let importantes = FLAG_STATUS.ACTIVO;
    this.subs.add(
      this.notificationService.changeFolder({ notifId, folderValue }).subscribe({
        next: res => {
          this.spinner.hide()
          this.savingtoFolder = false
          this.notificationResponse.notifications = this.notificationResponse.notifications.map(x => {
            if (notifId.includes(x.idNotificacion)) {
              x.importante = x.importante == FLAG_STATUS.ACTIVO ? FLAG_STATUS.INACTIVO : FLAG_STATUS.ACTIVO;
              importantes = x.importante;
            }
            return x;
          });
          if (this.folder == NotificationFolder.IMPORTANTES)
            this.loadNotifications(null, false, 0, quantity);
          const singular = notifId.length == 1;
          if (importantes == FLAG_STATUS.ACTIVO) {
            this.toastMessageService.showSuccess(`Se ${singular?'marcó': 'marcaron'} ${singular?'la':notifId.length} ${singular?'notificación': 'notificaciones'} como importante${singular?'':'s'}.`);
          } else {
            this.toastMessageService.showSuccess(`Se ${singular ? 'marcó' : 'marcaron'} ${singular ? 'la' : notifId.length} ${singular ? 'notificación' : 'notificaciones'} como no importante${singular?'':'s'}.`);          
          }
        },
        error: err => {
          this.spinner.hide();
          this.savingtoFolder = false
          this.toastMessageService.showError("No se puedo completar el guardado, inténtelo más tarde.");
        }
      })
    );
  }

  buscarTramite() {
    this.loadNotifications(null, false, 0, 0, true)
  }

  get esPersonaNatural() {
    return TIPO_PERSONA.NATURAL == this.authService.decoded?.tipo && DOBLE_PERFIL.NATURAL == this.authService.decoded.session
  }

  get esAbogado() {
    return TIPO_PERSONA.NATURAL == this.authService.decoded?.tipo && DOBLE_PERFIL.ABOGADO == this.authService.decoded.session
  }


  capitalizedFirstWord(value: string) {
    return capitalizedFirstWord(value)
  }

  capitalized(value: string) {
    return capitalized(value).replaceAll(',', '')
  }

}