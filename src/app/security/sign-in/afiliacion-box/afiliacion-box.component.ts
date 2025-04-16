import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TerminosCondicionesComponent } from '../terminos-condiciones/terminos-condiciones.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DtoService } from '../../service/dto.service';
import { TerminosCondicionesService } from '../../service/terminos-condiciones.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { handleErrorWithAlert } from 'src/app/utiils/funcs';
import { AlertService } from 'src/app/service/Alert.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-afiliacion-box',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
  ],
  templateUrl: './afiliacion-box.component.html',
  styleUrls: ['./afiliacion-box.component.scss'],
  providers: [MessageService, AlertService, DialogService]
})
export class AfiliacionBoxComponent implements OnInit {

  public affiliationIcon: string = 'assets/svg/tracking.svg'
  public appName: string = environment.APP_NAME

  constructor(
    private dialogService: DialogService,
    private router: Router,
    private dtoService: DtoService,
    private terminosCondicionesService: TerminosCondicionesService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void { /** Empty  */  }

  terminos(evt: MouseEvent) {
    evt.preventDefault();
    this.spinner.show();

    this.terminosCondicionesService.getTerminosCondiciones()
    .pipe(
      catchError((error: HttpErrorResponse) => handleErrorWithAlert(error, this.alertService, 'Error'))
    )
    .subscribe(
      {
        next: (terms) => {
          this.spinner.hide();
          this.openTerminosCondiciones(terms);
        },
        error: (error) => { this.spinner.hide(); }
      }
    );


    
  }

  openTerminosCondiciones(terms: string) {
    const ref = this.dialogService.open(TerminosCondicionesComponent, {
      width: `900px`,
      styleClass: 'terminos-condiciones',
      header: 'Tenga en cuenta lo siguiente',
      data: {terms}
    });

    ref.onClose.subscribe((accept: boolean) => {
      if (accept) {
        this.dtoService.setTcAccepted();
        this.router.navigate(['security', 'profile']);
      }
    });
  }
} 
