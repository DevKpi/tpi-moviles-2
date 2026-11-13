jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(),
    collection: jest.fn(() => ({ collection: 'reportes' })),
    deleteDoc: jest.fn(),
    doc: jest.fn((...parts) => parts),
    getDocs: jest.fn(),
    query: jest.fn((reference, ...constraints) => ({ reference, constraints })),
    updateDoc: jest.fn(),
    where: jest.fn((...parts) => ({ where: parts })),
}));

jest.mock('../firebase/firebase', () => ({
    auth: { currentUser: null },
    db: { database: 'test-db' },
}));

import { addDoc, deleteDoc, getDocs, updateDoc, where } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import { createReport, deleteReport, getAllReports, getUserReports, updateReport } from './reportService';

const validReport = {
    titulo: 'Bache en la esquina',
    descripcion: 'Hay un bache profundo junto al cruce peatonal.',
    categoria: 'Baches y Calzada',
    fotoUri: null,
    coordenadas: null,
};

describe('reportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        auth.currentUser = { uid: 'user-1' };
    });

    it('crea el reporte usando el UID de la sesión y estado Pendiente', async () => {
        addDoc.mockResolvedValue({ id: 'report-1' });

        const created = await createReport(validReport);

        expect(addDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
            userId: 'user-1',
            titulo: validReport.titulo,
            estado: 'Pendiente',
            coordenadas: null,
        }));
        expect(created).toEqual(expect.objectContaining({ id: 'report-1', userId: 'user-1' }));
    });

    it('rechaza crear reportes sin sesión', async () => {
        auth.currentUser = null;

        await expect(createReport(validReport)).rejects.toThrow('AUTH_REQUIRED');
        expect(addDoc).not.toHaveBeenCalled();
    });

    it('consulta solo los reportes del UID autenticado y los ordena por fecha', async () => {
        getDocs.mockResolvedValue({
            docs: [
                { id: 'older', data: () => ({ fechaCreacion: '2026-01-01T00:00:00.000Z' }) },
                { id: 'newer', data: () => ({ fechaCreacion: '2026-02-01T00:00:00.000Z' }) },
            ],
        });

        const reports = await getUserReports('user-1');

        expect(reports.map((report) => report.id)).toEqual(['newer', 'older']);
        expect(where).toHaveBeenCalledWith('userId', '==', 'user-1');
        expect(getDocs).toHaveBeenCalledTimes(1);
    });

    it('permite consultar reportes comunitarios solo con sesión activa', async () => {
        getDocs.mockResolvedValue({ docs: [] });

        await expect(getAllReports()).resolves.toEqual([]);
        auth.currentUser = null;
        await expect(getAllReports()).rejects.toThrow('AUTH_REQUIRED');
    });

    it('solo permite la transición de estado a Cancelado desde el cliente', async () => {
        await expect(updateReport('report-1', { estado: 'Resuelto' })).rejects.toThrow('INVALID_STATUS_TRANSITION');
        updateDoc.mockResolvedValue(undefined);
        await expect(updateReport('report-1', { estado: 'Cancelado' })).resolves.toEqual(expect.objectContaining({ estado: 'Cancelado' }));
    });

    it('actualiza y elimina por ID, delegando la propiedad a Firestore Rules', async () => {
        updateDoc.mockResolvedValue(undefined);
        deleteDoc.mockResolvedValue(undefined);

        await updateReport('report-1', { titulo: 'Título actualizado' });
        await deleteReport('report-1');

        expect(updateDoc).toHaveBeenCalledTimes(1);
        expect(deleteDoc).toHaveBeenCalledTimes(1);
    });
});
