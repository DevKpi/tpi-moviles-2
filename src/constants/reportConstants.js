export const REPORT_CATEGORIES = Object.freeze([
    'Baches y Calzada',
    'Iluminación Pública',
    'Semáforos',
    'Basura y Residuos',
    'Arbolado y Espacios Verdes',
    'Otros',
]);

export const REPORT_STATUS = Object.freeze({
    PENDING: 'Pendiente',
    UNDER_REVIEW: 'En revisión',
    RESOLVED: 'Resuelto',
    CANCELLED: 'Cancelado',
});

export const REPORT_STATUSES = Object.freeze(Object.values(REPORT_STATUS));

export const isValidCoordinates = (coordinates) => {
    if (coordinates === null || coordinates === undefined) return true;

    const { latitude, longitude } = coordinates;
    return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
};
