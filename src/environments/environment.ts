export const environment = {
    VERSION: 'v1.2.0',
    APP_NAME_TITLE: "Casilla Fiscal Electrónica",
    APP_NAME: "Casilla Fiscal Electrónica",
    ENTITY_NAME: 'Ministerio Público - Fiscalía de la Nación',
    AFILIACION_ENDPOINT: `http://localhost:8080/ms-afiliacion-casilla`,
    CASILLA_ENDPOINT: `http://localhost:8081/ms-casilla-electronica`,
    DOCUMENTOS_ENPOINT: `http://cfms-generales-documentos-bf-gestion-api-development.apps.dev.ocp4.cfe.mpfn.gob.pe/cfe/generales/documento/v1/cftm/t/gestion/obtienedocumento`,
    MAESTROS_ENDPOINT: `http://cfms-generales-maestros-bf-gestion-api-development.apps.dev.ocp4.cfe.mpfn.gob.pe/cfe/generales/maestro`,
    CAPTCHA_SITE_KEY: `6LeYCIcnAAAAAAU9CguAytPy7fML2_s1kAD21U8i`,
    HTTP_CASILLA_WEB: `https://cfe.mpfn.gob.pe/casilla-fiscal-electronica`,
    ENCRYPT_KEY: `KRx8zM2x7NDbbdcA`,
    TIME_TO_RESEND_CODE: 120, //segundos
    MAX_TIME_2FA: 600, //segundos
//Inserta esta clave de sitio en el código HTML que utiliza tu sitio.
//  6LcTgawpAAAAAAhBLMnCDdc5M0d64_jLiQUCte3e

//Utiliza esta clave secreta para la comunicación entre tu sitio y reCAPTCHA.
//6LcTgawpAAAAAF4LCayXuFofOw_h0vxskiHmnE-5


};