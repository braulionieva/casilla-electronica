import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {

  constructor(private messageService: MessageService) { }

  clear() {
    this.messageService.clear();
  }

  showSuccess(detail: string, summary?: string) {
    this.messageService.add({ severity: 'success', summary, detail});
}

showInfo(detail: string, summary?: string) {
    this.messageService.add({ severity: 'info', summary, detail});
}

showWarn(detail: string, summary?: string) {
    this.messageService.add({ severity: 'warn', summary, detail});
}

showError(detail: string, summary?: string) {
    this.messageService.add({ severity: 'error', summary, detail});
}
}
