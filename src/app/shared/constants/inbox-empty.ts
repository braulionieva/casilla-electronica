export const BUZON_VACIO_MESSAGES = [
    {
        title: 'Recibidos',
        emptyTitle: 'Tu buzón de notificaciones está vacío.',
        emptyDescription: 'Aquí se muestran las notificaciones y citaciones enviadas por un despacho fiscal en el marco de un proceso penal en curso del cual formas parte.'
    },
    {
        title: 'Destacados',
        emptyTitle: 'Notificaciones destacadas',
        emptyDescription: 'No hay notificaciones o citaciones destacadas. Las estrellas te permiten dar a las notificaciones recibidas un estado especial para poder encontrarlas con mayor facilidad. Para destacar una notificación, haz clic en la estrella al lado izquierdo de una notificación o citación.'
    },
    {
        title: 'Importantes',
        emptyTitle: 'Notificaciones importantes',
        emptyDescription: 'No hay notificaciones o citaciones importantes. Las banderas te permiten dar a las notificaciones recibidas un estado especial para resaltar su nivel de importancia. Para resaltar una notificación como importante, haz clic en la bandera al lado izquierdo de la misma.'
    },
    {
        title: 'Leídos',
        emptyTitle: '',
        emptyDescription: 'No hay notificaciones leídas.'
    },
    {
        title: 'Archivados',
        emptyTitle: '',
        emptyDescription: 'No hay notificaciones archivadas.'
    },
    {
        title: 'Citaciones',
        emptyTitle: '',
        emptyDescription: 'No hay citaciones recibidas.'
    },
    {
        title: 'Notificaciones',
        emptyTitle: '',
        emptyDescription: 'No hay notificaciones recibidas.'
    }
]

export const obtenerMensajeVacio = ( title: string ) => {
    return BUZON_VACIO_MESSAGES.find( mensaje => mensaje.title === title ) || null
}