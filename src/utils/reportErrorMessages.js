const errorMessages = {
    AUTH_REQUIRED: 'Tu sesión no está activa. Vuelve a iniciar sesión e inténtalo otra vez.',
    USER_MISMATCH: 'La sesión cambió. Actualiza la pantalla e inténtalo de nuevo.',
    INVALID_REPORT_DATA: 'Revisa los datos del reclamo e inténtalo otra vez.',
    INVALID_REPORT_UPDATES: 'No se pudieron guardar esos cambios.',
    INVALID_REPORT_ID: 'No se encontró el reclamo que quieres modificar.',
    INVALID_STATUS_TRANSITION: 'Solo puedes cancelar un reclamo pendiente o en revisión.',
    INVALID_TITLE: 'El título debe tener entre 1 y 80 caracteres.',
    INVALID_DESCRIPTION: 'La descripción debe tener entre 1 y 1000 caracteres.',
    INVALID_CATEGORY: 'Selecciona una categoría válida.',
    INVALID_COORDINATES: 'La ubicación no tiene coordenadas válidas.',
    LOCATION_DISABLED: 'Activa la ubicación del dispositivo o continúa sin agregar coordenadas.',
    LOCATION_PERMISSION_DENIED: 'No se otorgó permiso de ubicación. Puedes publicar el reclamo sin coordenadas.',
    LOCATION_PERMISSION_UNAVAILABLE: 'No se pudo consultar el permiso de ubicación. Puedes continuar sin coordenadas.',
    LOCATION_STATUS_UNAVAILABLE: 'No se pudo comprobar si la ubicación está activa.',
    LOCATION_UNAVAILABLE: 'No se pudo obtener la ubicación actual. Inténtalo de nuevo o continúa sin coordenadas.',
    LOCATION_WATCH_FAILED: 'No se pudo iniciar el seguimiento de ubicación.',
    IMAGE_LIBRARY_PERMISSION_DENIED: 'No se otorgó permiso para acceder a la galería.',
    IMAGE_CAMERA_PERMISSION_DENIED: 'No se otorgó permiso para usar la cámara.',
    IMAGE_PERMISSION_UNAVAILABLE: 'No se pudo consultar el permiso de imágenes.',
    IMAGE_LIBRARY_UNAVAILABLE: 'No se pudo abrir la galería.',
    IMAGE_CAMERA_UNAVAILABLE: 'No se pudo abrir la cámara.',
    'permission-denied': 'Firebase rechazó la operación. Comprueba las reglas y los permisos de tu cuenta.',
    unavailable: 'No hay conexión con Firebase. Comprueba tu conexión e inténtalo de nuevo.',
    'network-request-failed': 'No hay conexión a Internet. Comprueba tu conexión e inténtalo de nuevo.',
};

export const getReportErrorMessage = (error, fallback = 'Ocurrió un error. Inténtalo nuevamente.') => {
    const code = error?.code || error?.message;
    return errorMessages[code] || fallback;
};
