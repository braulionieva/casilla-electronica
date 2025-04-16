import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AlertComponent, AlertModel, AlertType } from '../shared/components/modal/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private dialogService: DialogService) { }

  showError(title: string, description: string) {
    return this.showMessage(title, description, 'error')
  }

  showWarning(title: string, description: string, buttons: Partial<AlertModel> = {},  width = '450px') {
    return this.showMessage(title, description, 'warning', buttons, width)
  }

  

  showSuccess(title: string, description: string, buttons: Partial<AlertModel> = {},  width = '450px') {
    return this.showMessage(title, description, 'success', buttons, width);
  }

  private showMessage(title: string, message: string, type: AlertType, 
    buttons: Partial<AlertModel> = {}, width = '450px') {

    return this.dialogService.open(AlertComponent, {
      width,
      showHeader: false,
      styleClass: 'alert-modal',
      data: {
        title,
        message,
        type,
        ...buttons
      }
    } as DynamicDialogConfig<AlertModel>);
  }

  showConfirm(title: string, message: string, buttons: Partial<AlertModel> = {}, width = '450px') {
    return this.showMessage(title, message, 'warning', {...buttons, confirm: true}, width);
  }


}
