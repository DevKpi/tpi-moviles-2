import { REPORT_CATEGORIES, isValidCoordinates } from '../constants/reportConstants';

export const validateReport = (input = {}) => {
    const report = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const errors = {};
    const normalizedTitle = typeof report.titulo === 'string' ? report.titulo.trim() : '';
    const normalizedDescription = typeof report.descripcion === 'string' ? report.descripcion.trim() : '';

    if (!normalizedTitle) {
        errors.titulo = 'Escribe un título para el reclamo.';
    } else if (normalizedTitle.length > 80) {
        errors.titulo = 'El título no puede superar los 80 caracteres.';
    }

    if (!normalizedDescription) {
        errors.descripcion = 'Describe brevemente el problema.';
    } else if (normalizedDescription.length > 1000) {
        errors.descripcion = 'La descripción no puede superar los 1000 caracteres.';
    }

    if (!REPORT_CATEGORIES.includes(report.categoria)) {
        errors.categoria = 'Selecciona una categoría válida.';
    }

    if (!isValidCoordinates(report.coordenadas ?? null)) {
        errors.coordenadas = 'La ubicación no tiene coordenadas válidas.';
    }

    return errors;
};

export const formatReportDate = (value) => {
    if (!value) return 'Fecha no disponible';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
