import { useCallback, useContext, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CategorySelector from '../components/CategorySelector';
import ReportCard from '../components/ReportCard';
import { REPORT_STATUS } from '../constants/reportConstants';
import { AuthContext } from '../context/AuthContext';
import { deleteReport, getUserReports, updateReport } from '../services/reportService';
import { validateReport } from '../services/reportValidation';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { reportStyles as styles, reportColors } from '../styles/ReportStyles';

const emptyDraft = { titulo: '', descripcion: '', categoria: '' };

export default function ReportsScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [operation, setOperation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [notice, setNotice] = useState('');
    const [editingReport, setEditingReport] = useState(null);
    const [draft, setDraft] = useState(emptyDraft);
    const [editErrors, setEditErrors] = useState({});
    const [confirmConfig, setConfirmConfig] = useState(null);

    const loadReports = useCallback(async (isRefresh = false) => {
        if (!user?.uid) {
            setReports([]);
            setErrorMessage('Inicia sesión para consultar tus reportes.');
            setLoading(false);
            setRefreshing(false);
            return;
        }

        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setErrorMessage('');

        try {
            const results = await getUserReports(user.uid);
            setReports(results);
        } catch (error) {
            setErrorMessage(getReportErrorMessage(error, 'No se pudieron cargar tus reportes.'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.uid]);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [loadReports])
    );

    const openEdit = (report) => {
        setEditingReport(report);
        setDraft({ titulo: report.titulo || '', descripcion: report.descripcion || '', categoria: report.categoria || '' });
        setEditErrors({});
        setErrorMessage('');
    };

    const closeEdit = () => {
        if (!operation) {
            setEditingReport(null);
            setDraft(emptyDraft);
            setEditErrors({});
        }
    };

    const saveEdit = async () => {
        const validationErrors = validateReport({ ...draft, coordenadas: editingReport?.coordenadas || null });
        setEditErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setOperation(true);
        setErrorMessage('');
        try {
            await updateReport(editingReport.id, {
                titulo: draft.titulo,
                descripcion: draft.descripcion,
                categoria: draft.categoria,
            });
            setEditingReport(null);
            setNotice('Los cambios se guardaron.');
            await loadReports(true);
        } catch (error) {
            setErrorMessage(getReportErrorMessage(error, 'No se pudieron guardar los cambios.'));
        } finally {
            setOperation(false);
        }
    };

    const requestCancel = (report) => {
        setConfirmConfig({
            title: 'Cancelar reclamo',
            message: `¿Quieres cambiar “${report.titulo}” al estado Cancelado?`,
            confirmLabel: 'Sí, cancelar',
            destructive: false,
            onConfirm: async () => {
                setOperation(true);
                setErrorMessage('');
                try {
                    await updateReport(report.id, { estado: REPORT_STATUS.CANCELLED });
                    setNotice('El reclamo quedó cancelado.');
                    await loadReports(true);
                } catch (error) {
                    setErrorMessage(getReportErrorMessage(error, 'No se pudo cancelar el reclamo.'));
                } finally {
                    setOperation(false);
                }
            },
        });
    };

    const requestDelete = (report) => {
        setConfirmConfig({
            title: 'Eliminar reclamo',
            message: `Se eliminará “${report.titulo}” de forma permanente.`,
            confirmLabel: 'Eliminar',
            destructive: true,
            onConfirm: async () => {
                setOperation(true);
                setErrorMessage('');
                try {
                    await deleteReport(report.id);
                    setNotice('El reclamo se eliminó.');
                    await loadReports(true);
                } catch (error) {
                    setErrorMessage(getReportErrorMessage(error, 'No se pudo eliminar el reclamo.'));
                } finally {
                    setOperation(false);
                }
            },
        });
    };

    const confirmAction = async () => {
        const action = confirmConfig?.onConfirm;
        setConfirmConfig(null);
        if (action) await action();
    };

    const openNewReport = () => navigation?.navigate?.('NuevoReporte');

    return (
        <View style={styles.screen}>
            <View style={[styles.content, { flex: 1, paddingBottom: 10 }]}>
                <View style={styles.header}>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>UrbanAlert · Seguimiento</Text>
                        <Text style={styles.title}>Mis reportes</Text>
                        <Text style={styles.subtitle}>Consulta su estado y administra tus reclamos.</Text>
                    </View>
                    <Pressable accessibilityRole="button" onPress={openNewReport} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>+ Nuevo</Text>
                    </Pressable>
                </View>

                {!!notice && <Text style={styles.notice}>{notice}</Text>}
                {!!errorMessage && (
                    <View style={{ gap: 8 }}>
                        <Text accessibilityRole="alert" style={[styles.notice, styles.errorNotice]}>{errorMessage}</Text>
                        {!loading && (
                            <Pressable accessibilityRole="button" onPress={() => loadReports()} style={[styles.button, styles.buttonOutline, { alignSelf: 'flex-start' }]}>
                                <Text style={styles.buttonTextSecondary}>Reintentar</Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {loading ? (
                    <View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>
                        <ActivityIndicator size="large" color={reportColors.primary} />
                        <Text style={styles.emptyText}>Cargando tus reportes…</Text>
                    </View>
                ) : reports.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Todavía no tienes reportes</Text>
                        <Text style={styles.emptyText}>Cuando encuentres un problema en la vía pública, puedes registrarlo desde aquí.</Text>
                        <Pressable accessibilityRole="button" onPress={openNewReport} style={[styles.button, styles.buttonPrimary]}>
                            <Text style={styles.buttonText}>Crear mi primer reporte</Text>
                        </Pressable>
                    </View>
                ) : (
                    <FlatList
                        data={reports}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ReportCard
                                report={item}
                                actions
                                onEdit={openEdit}
                                onCancel={requestCancel}
                                onDelete={requestDelete}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadReports(true)} tintColor={reportColors.primary} />}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <Modal visible={!!editingReport} transparent animationType="fade" onRequestClose={closeEdit}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Editar reclamo</Text>
                        <View style={styles.field}>
                            <Text style={styles.label}>Título</Text>
                            <TextInput
                                accessibilityLabel="Editar título"
                                value={draft.titulo}
                                onChangeText={(titulo) => setDraft((current) => ({ ...current, titulo }))}
                                maxLength={80}
                                editable={!operation}
                                style={[styles.input, editErrors.titulo && styles.inputError]}
                            />
                            {!!editErrors.titulo && <Text style={styles.fieldError}>{editErrors.titulo}</Text>}
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                accessibilityLabel="Editar descripción"
                                value={draft.descripcion}
                                onChangeText={(descripcion) => setDraft((current) => ({ ...current, descripcion }))}
                                maxLength={1000}
                                multiline
                                editable={!operation}
                                style={[styles.input, styles.textArea, editErrors.descripcion && styles.inputError]}
                            />
                            {!!editErrors.descripcion && <Text style={styles.fieldError}>{editErrors.descripcion}</Text>}
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Categoría</Text>
                            <CategorySelector
                                value={draft.categoria}
                                onChange={(categoria) => setDraft((current) => ({ ...current, categoria }))}
                                disabled={operation}
                            />
                            {!!editErrors.categoria && <Text style={styles.fieldError}>{editErrors.categoria}</Text>}
                        </View>
                        <View style={styles.row}>
                            <Pressable accessibilityRole="button" disabled={operation} onPress={closeEdit} style={[styles.button, styles.buttonOutline]}>
                                <Text style={styles.buttonTextSecondary}>Volver</Text>
                            </Pressable>
                            <Pressable accessibilityRole="button" disabled={operation} onPress={saveEdit} style={[styles.button, styles.buttonPrimary, operation && styles.buttonDisabled]}>
                                {operation ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Guardar cambios</Text>}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={!!confirmConfig} transparent animationType="fade" onRequestClose={() => setConfirmConfig(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>{confirmConfig?.title}</Text>
                        <Text style={styles.cardDescription}>{confirmConfig?.message}</Text>
                        <View style={styles.row}>
                            <Pressable accessibilityRole="button" onPress={() => setConfirmConfig(null)} style={[styles.button, styles.buttonOutline]}>
                                <Text style={styles.buttonTextSecondary}>Volver</Text>
                            </Pressable>
                            <Pressable
                                accessibilityRole="button"
                                onPress={confirmAction}
                                style={[styles.button, confirmConfig?.destructive ? styles.buttonDanger : styles.buttonPrimary]}
                            >
                                <Text style={confirmConfig?.destructive ? styles.buttonTextDanger : styles.buttonText}>
                                    {confirmConfig?.confirmLabel}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
