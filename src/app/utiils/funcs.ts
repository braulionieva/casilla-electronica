import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http"
import { throwError } from "rxjs"
import { ToastMessageService } from "../service/toast-message.service"
import { AlertService } from "../service/Alert.service"

export const soloNumeros = (palabra: string) => {
  return palabra?.replace(/\D/g, '')  
}

export const handleErrorWithToast = (error: HttpErrorResponse, toast: ToastMessageService) => {
  console.log("🚀 ~ handleErrorWithToast ~ error:", error)
  if ( error?.error?.message.includes('La Casilla Fiscal Electrónica se encuentra bloqueada') ) {
    return throwError(() => error)
  }
  if ( error?.error?.message.includes('Cuenta bloqueada porque se ha alcanzado el número máximo de intentos permitidos') ) {
    return throwError(() => error)
  }
  if ( error?.error?.message.includes('Tener en cuenta que le quedan') ) {
    return throwError(() => error)
  }
  if (!navigator.onLine || !error.status) {
    toast.showError('Ocurrió un problema inesperado en el sistema. Intentar nuevamente.', 'Error');
    
  }else if (error.status != HttpStatusCode.InternalServerError) {
    toast.showWarn(error.error?.message);
  } else {
  toast.showWarn('Ocurrió un problema inesperado en el sistema. Intentar nuevamente.');
  } 
  return throwError(() => error);
} 

// handleErrorWithAlert
export const handleErrorWithAlert = (error: HttpErrorResponse, alertService: AlertService, title = `Verificación incorrecta`) => {
  if (!navigator.onLine || !error.status) {
    alertService.showWarning(title, 'Ocurrió un problema inesperado en el sistema. Intentar nuevamente.');
    
  }else if (error.status != HttpStatusCode.InternalServerError) {
    alertService.showWarning(title, error.error?.message);    
  } else {
    alertService.showWarning(title, 'Ocurrió un problema inesperado en el sistema. Intentar nuevamente.');
  } 
  return throwError(() => error);
}

export const capitalizedFirstWord = ( texto:any='' ) => {
  if (typeof texto !== 'string' || texto.length === 0) {
    return texto;
  }
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export const capitalized = ( text: any = '' ) => {
  if (typeof text !== 'string') {
    return '';
  }
  const word = text.toLowerCase().split(' ');
  for (let i = 0; i < word.length; i++) {
    word[i] = word[i].charAt(0).toUpperCase() + word[i].slice(1);
  }
  return word.join(' ');
}
