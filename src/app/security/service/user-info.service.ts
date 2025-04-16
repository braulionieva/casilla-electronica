import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

    constructor(
        private readonly http: HttpClient,
        private readonly deviceService: DeviceDetectorService
    ) {}

    async getIPAddress(): Promise<string> {
        try {
            const response = await firstValueFrom(this.http.get<{ ip: string }>('https://api64.ipify.org?format=json'));
            return response?.ip ?? 'Desconocida';
        } catch (error) {
            console.error('Error obteniendo IP:', error);
            return 'Desconocida';
        }
    }

    getDeviceInfo(): string {

        let device: string = ''

        if (this.deviceService.isMobile()) {
            device = 'Móvil';
        } else if (this.deviceService.isTablet()) {
            device = 'Tablet';
        } else {
            device = 'Escritorio';
        }
            
        let os: string = this.deviceService.os
        let browser: string = this.deviceService.browser

        return `${device}/${os}/${browser}`

    }
  
}