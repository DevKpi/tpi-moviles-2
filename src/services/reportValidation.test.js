import { REPORT_CATEGORIES } from '../constants/reportConstants';
import { validateReport } from './reportValidation';

const validDraft = {
    titulo: 'Bache en la esquina',
    descripcion: 'Hay un bache profundo junto al cruce peatonal.',
    categoria: REPORT_CATEGORIES[0],
    coordenadas: { latitude: -34.6, longitude: -58.4 },
};

describe('validateReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('acepta un reclamo completo con coordenadas válidas', () => {
        expect(validateReport(validDraft)).toEqual({});
    });

    it('permite enviar el reclamo sin ubicación', () => {
        expect(validateReport({ ...validDraft, coordenadas: null })).toEqual({});
    });

    it('requiere título, descripción y categoría válida', () => {
        expect(validateReport({ titulo: ' ', descripcion: '', categoria: 'Otra categoría' })).toEqual({
            titulo: 'Escribe un título para el reclamo.',
            descripcion: 'Describe brevemente el problema.',
            categoria: 'Selecciona una categoría válida.',
        });
    });

    it('rechaza campos que superan los límites definidos', () => {
        const errors = validateReport({
            ...validDraft,
            titulo: 't'.repeat(81),
            descripcion: 'd'.repeat(1001),
        });

        expect(errors.titulo).toBe('El título no puede superar los 80 caracteres.');
        expect(errors.descripcion).toBe('La descripción no puede superar los 1000 caracteres.');
    });

    it('rechaza coordenadas fuera del rango geográfico', () => {
        expect(validateReport({ ...validDraft, coordenadas: { latitude: 120, longitude: 0 } })).toHaveProperty('coordenadas');
    });
});
