export type SmsGenerateCodeRequest = { code: string, cellphone: string };
export type SmsGenerateCodeResponse = { success: boolean, message: string }
export type IdType = { tipoDoc: string, tipoPer: string, abrev: string, description: string }
export type PersonRespone = { dni: string, nombres: string, apellidoPaterno: string, apellidoMaterno: string, fechaEmision: string }
export type UbigeoRespone = { id: string, name: string }
export type AffiliationRequest = {
    cellphone?: string, captcha: string, smsCode: string, idType: string,
    idNumber: string, dueDate: string, nombres: string, apellidoPaterno: string,
    apellidoMaterno: string, email: string, emailConfirm: string, gender: string,
    departamento: string, provincia: string, distrito: string, direccion: string
};
export type CodeValidationRequest = { dni: string, code: string };

export type LoginResponse = { user: string, token: string, dni: string };
export type AccountRecord = {
    correo: string, numDoc: string, nombre: string, apePat: string,
    apeMat: string, flagActCta: string, tipoUsr: string, cellphone: string, cuentaId?: number,
    otros?: { idColegioAbogados: string, nuColegio: string }
}
export type SimpleResponse = {z?:string} & SmsGenerateCodeResponse;


export type NotificationAttachment = { id: number; notificationId: number; documentType: string; fileName: string; url: string; }
export type RelatedAffiliate = { id: number; notificationId: number; fullName: string; documentId: string; casillaId: string; notifiedAt: Date; }

export type SidebarMenu = { name: string, id: string, url: string, items: SidebarMenu[], icon: string }
export type SidebarMenuResponse = { folders: SidebarMenu[], tags: SidebarMenu[] };


export type SearchNotificationRequestDto = {
    subject?: string | null, caseNumber?: string | null, proceduralAct?: string | null,
    notificationNumber?: string | null, createdAtStart?: any, createdAtEnd?: any,
}

export type UpdateEmailRequest = {
    code: string;
    email: string;
    oldEmail: string;
}







//2024
export type ListItemResponse = {
    id: number,
    nombre: string,
}

export type PersonaNaturalAfiliacion = {
    [key: string]: number | string | boolean | undefined;
    tipoDocumento: number;
    tipoDocumentoLabel: string;
    numeroDocumento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaEmision: string;
    celular: string;
    correo: string;
    tipoPersona: number;
    ubigeoDomicilio: string;
    direccionDomicilio: string;
    sexo: string;
    codigoVerificacion: string;
    idColegio?: string
    numeroColegiatura?: string,
    tc?: boolean,
    validation: any
}

export type HttpGenericResponse = { success: boolean, message: string, code: string };

export const TIPO_PERSONA = {
    NATURAL: '1',
    JURIDICA: '2',
}

export type NotificacionBandeja = {
    idNotificacion: string;
    numeroCaso: string;
    tipoCedula: string;
    urgencia: string;
    tipoSujeto: string;
    estado: string;
    numeroCedula: string;
    estapaProcesal: string;
    actoProcesal: string;
    tramite: string;
    fechaEnvio: Date;
    tag: string;
    folder: string;
    archivado: string;
    nombreCompleto?: string;
    adjuntos: NotificacionAdjunto[];
    destacado: string,
    importante: string
}


export interface NotificacionDetalle {
    idNotificacion: string;
    nombreCompleto: string;
    fechaEnvio: Date;
    cedula: string;
    tipoCedula: string;
    despacho: string;
    numeroCaso: string;
    entidad: string;
    tipoDomicilio: string;
    idTipoDomicilio: string;
    folder: string,
    adjuntos: NotificacionAdjunto[];
    archivado: string,
}

export interface NotificacionAdjunto {
    idNotificacionAdjunto: string;
    idDocumento: string;
    coDocumento: string;
    noDocumentoOrigen: string;
}

export type UpdatePasswordRequest = { userId: string, pw: string, oldPw?: string, token: string,codigoVerificacion?: string, idTipoVerificacion?:number};
export type SearchNotificationResponseDto = { notifications: NotificacionBandeja[], total: number; size: number }
export type ChangeFolderRequest = { notifId: string[], folderValue: string; }

export enum NotificationStatus {
    RECEIVED = "0",
    READ = "1",
}

export const NotificationFolder = {
    RECIBIDOS: '1',
    LEIDOS: '2',
    DESTACADOS: '3',
    IMPORTANTES: '4',
    ARCHIVADOS: '5',
}

export const NotificationTag = {
    NOTIFICACION: 'N',
    CITACION: 'C'
}

export const DOBLE_PERFIL = {
    ABOGADO: '1',
    NATURAL: '0'
}

export type UserSession = {
    abogado: string;
    email: string;
    numeroDocumento: string;
    userName: string;
    session: string;
    defensor: string;
    tipo: string;
    sub: string;
    iat: number;
    exp: number;
}

export type UpdateProfileRequest = {
    personaNatural: boolean;
    abogado: boolean;
    numeroCasilla: string;
    idColegioAbogados: string;
    numeroColegiatura: string;
}

export const FLAG_STATUS = {
    ACTIVO: '1',
    INACTIVO: '0'
}

export const ValidationField = {
    FECHA_EMISION: 456789,
    DIGITO_VERIFICACION: 234567,
    UBIGEO: 678901,
    NOMBRE_MADRE: 789012,
    NOMBRE_PADRE: 912345
  } as const;



  export const LOGIN_TYPE = {
    ABOGADO: 'Xq7f',
    DEFENSOR_PUBLICO: 'Gy2P',
    PERSONA_NATURAL: 'Tn8L'
  } as const;

  export const APP_HEADER = {

    HEADER_X_TOKEN_AFIL: "x-token-afil"

  }


