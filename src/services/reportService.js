import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { REPORT_CATEGORIES, REPORT_STATUS, isValidCoordinates } from '../constants/reportConstants';
import { validateReport } from './reportValidation';

const reportsCollection = () => collection(db, 'reportes');

const requireAuthenticatedUser = (expectedUserId) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('AUTH_REQUIRED');
    }

    if (expectedUserId && currentUser.uid !== expectedUserId) {
        throw new Error('USER_MISMATCH');
    }

    return currentUser;
};

const toReport = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });
const newestFirst = (reports) => reports.sort((left, right) => {
    const leftDate = new Date(left.fechaCreacion || 0).getTime();
    const rightDate = new Date(right.fechaCreacion || 0).getTime();
    return (Number.isNaN(rightDate) ? 0 : rightDate) - (Number.isNaN(leftDate) ? 0 : leftDate);
});

const validatePhotoUri = (photoUri) => {
    if (photoUri !== null && photoUri !== undefined && typeof photoUri !== 'string') {
        throw new Error('INVALID_PHOTO_URI');
    }
};

export const createReport = async (reportData) => {
    const user = requireAuthenticatedUser();
    const errors = validateReport(reportData);

    if (Object.keys(errors).length > 0) {
        throw new Error('INVALID_REPORT_DATA');
    }

    const fotoUri = reportData.fotoUri || null;
    validatePhotoUri(fotoUri);

    const now = new Date().toISOString();
    const payload = {
        userId: user.uid,
        titulo: reportData.titulo.trim(),
        descripcion: reportData.descripcion.trim(),
        categoria: reportData.categoria,
        estado: REPORT_STATUS.PENDING,
        fotoUri,
        coordenadas: reportData.coordenadas || null,
        fechaCreacion: now,
        fechaActualizacion: now,
    };

    const document = await addDoc(reportsCollection(), payload);
    return { id: document.id, ...payload };
};

export const getUserReports = async (userId) => {
    const user = requireAuthenticatedUser(userId);
    const reportsQuery = query(reportsCollection(), where('userId', '==', user.uid));
    const snapshot = await getDocs(reportsQuery);

    return newestFirst(snapshot.docs.map(toReport));
};

export const getAllReports = async () => {
    requireAuthenticatedUser();
    const reportsQuery = query(reportsCollection());
    const snapshot = await getDocs(reportsQuery);

    return newestFirst(snapshot.docs.map(toReport));
};

const sanitizeUpdates = (updates) => {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        throw new Error('INVALID_REPORT_UPDATES');
    }

    const allowedFields = ['titulo', 'descripcion', 'categoria', 'estado', 'fotoUri', 'coordenadas'];
    const updateFields = Object.keys(updates);

    if (updateFields.length === 0 || updateFields.some((field) => !allowedFields.includes(field))) {
        throw new Error('INVALID_REPORT_UPDATES');
    }

    const sanitized = { ...updates };

    if (sanitized.titulo !== undefined) {
        if (typeof sanitized.titulo !== 'string') throw new Error('INVALID_TITLE');
        sanitized.titulo = sanitized.titulo.trim();
        if (!sanitized.titulo || sanitized.titulo.length > 80) throw new Error('INVALID_TITLE');
    }

    if (sanitized.descripcion !== undefined) {
        if (typeof sanitized.descripcion !== 'string') throw new Error('INVALID_DESCRIPTION');
        sanitized.descripcion = sanitized.descripcion.trim();
        if (!sanitized.descripcion || sanitized.descripcion.length > 1000) throw new Error('INVALID_DESCRIPTION');
    }

    if (sanitized.categoria !== undefined && !REPORT_CATEGORIES.includes(sanitized.categoria)) {
        throw new Error('INVALID_CATEGORY');
    }

    if (sanitized.estado !== undefined && sanitized.estado !== REPORT_STATUS.CANCELLED) {
        throw new Error('INVALID_STATUS_TRANSITION');
    }

    if (sanitized.coordenadas !== undefined && !isValidCoordinates(sanitized.coordenadas)) {
        throw new Error('INVALID_COORDINATES');
    }

    if (sanitized.fotoUri !== undefined) validatePhotoUri(sanitized.fotoUri);

    return sanitized;
};

export const updateReport = async (reportId, updates) => {
    requireAuthenticatedUser();
    if (!reportId || typeof reportId !== 'string') throw new Error('INVALID_REPORT_ID');

    const sanitized = sanitizeUpdates(updates);
    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, 'reportes', reportId), {
        ...sanitized,
        fechaActualizacion: updatedAt,
    });

    return { id: reportId, ...sanitized, fechaActualizacion: updatedAt };
};

export const deleteReport = async (reportId) => {
    requireAuthenticatedUser();
    if (!reportId || typeof reportId !== 'string') throw new Error('INVALID_REPORT_ID');

    await deleteDoc(doc(db, 'reportes', reportId));
    return { id: reportId, deleted: true };
};
