import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertModel = {
  type: AlertType,
  message: string,
  title: string,
  confirm: boolean,
  confirmLabel: string,
  cancelLabel: string,
};
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  title = '';
  message = '';
  type = 'success';
  confirm = false;
  confirmLabel = 'Aceptar';
  cancelLabel = 'Cancelar';
  public svgAlerta: string = 'assets/svg/alert.svg'


  constructor(
    public ref: DynamicDialogRef,
    private dialogRef: DynamicDialogConfig,
    ) { }

ngOnInit(): void {
  const data = this.dialogRef.data as AlertModel

  this.title = data.title || '';
    this.message = data.message || '';
    this.type = data.type || 'success';
    this.confirm = data.confirm || false;
    this.confirmLabel = data.confirmLabel || 'Aceptar';
    this.cancelLabel = data.cancelLabel || 'Cancelar';
    if(this.type==='error'){this.svgAlerta = 'assets/svg/error.svg'}

}

  ok() {
    this.ref.close(true)
  }

  cancelar() {
    this.ref.close(false)
  }

  get alertType() {
    return 'pi-info-circle';
  }
}
