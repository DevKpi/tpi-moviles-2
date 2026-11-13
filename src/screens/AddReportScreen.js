import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import CategorySelector from '../components/CategorySelector';
import { AuthContext } from '../context/AuthContext';
import { createReport } from '../services/reportService';
import { getCurrentLocation } from '../services/locationService';
import { pickImage, takePhoto } from '../services/ImageService';
import { validateReport } from '../services/reportValidation';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { reportStyles as styles, reportColors } from '../styles/ReportStyles';

const initialDraft = {
    titulo: '',
    descripcion: '',
    categoria: '',
    coordenadas: null,
    fotoUri: null,
};

export default function AddReportScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [draft, setDraft] = useState(initialDraft);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState(null);
    const [created, setCreated] = useState(false);

    const updateDraft = (field, value) => {
        setDraft((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setMessage(null);
    };

    const detectLocation = async () => {
        setBusy('location');
        setMessage(null);
        try {
            const location = await getCurrentLocation();
            updateDraft('coordenadas', {
                latitude: location.latitude,
                longitude: location.longitude,
            });
            setMessage({ type: 'success', text: 'Ubicación agregada al reclamo.' });
        } catch (error) {
            setMessage({ type: 'error', text: getReportErrorMessage(error, 'No se pudo obtener la ubicación.') });
        } finally {
            setBusy('');
        }
    };

    const choosePhoto = async (picker, busyKey) => {
        setBusy(busyKey);
        setMessage(null);
        try {
            const uri = await picker();
            if (uri) updateDraft('fotoUri', uri);
        } catch (error) {
            setMessage({ type: 'error', text: getReportErrorMessage(error, 'No se pudo seleccionar la fotografía.') });
        } finally {
            setBusy('');
        }
    };

    const submitReport = async () => {
        const validationErrors = validateReport(draft);
        setErrors(validationErrors);
        setMessage(null);

        if (Object.keys(validationErrors).length > 0) {
            setMessage({ type: 'error', text: 'Revisa los campos marcados antes de publicar.' });
            return;
        }

        if (!user?.uid) {
            setMessage({ type: 'error', text: getReportErrorMessage({ code: 'AUTH_REQUIRED' }) });
            return;
        }

        setBusy('submit');
        try {
            await createReport(draft);
            setCreated(true);
            setMessage({ type: 'success', text: 'El reclamo se publicó correctamente.' });
        } catch (error) {
            setMessage({ type: 'error', text: getReportErrorMessage(error, 'No se pudo publicar el reclamo.') });
        } finally {
            setBusy('');
        }
    };

    const goBack = () => {
        if (navigation?.canGoBack?.()) navigation.goBack();
        else navigation?.navigate?.('MisReportes');
    };

    const goToReports = () => {
        if (navigation?.replace) navigation.replace('MisReportes');
        else navigation?.navigate?.('MisReportes');
    };

    const isBusy = Boolean(busy);
    const fieldStyle = (field) => [styles.input, errors[field] && styles.inputError];

    return (
        <View style={styles.screen}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.headerCopy}>
                            <Text style={styles.eyebrow}>UrbanAlert · Nuevo reporte</Text>
                            <Text style={styles.title}>Contanos qué pasó</Text>
                            <Text style={styles.subtitle}>Los datos ayudan a ubicar y entender el problema.</Text>
                        </View>
                        <Pressable accessibilityRole="button" onPress={goBack} style={[styles.button, styles.buttonOutline]}>
                            <Text style={styles.buttonTextSecondary}>Volver</Text>
                        </Pressable>
                    </View>

                    {message && (
                        <Text accessibilityRole="alert" style={[styles.notice, message.type === 'error' && styles.errorNotice]}>
                            {message.text}
                        </Text>
                    )}

                    {created ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Reporte enviado</Text>
                            <Text style={styles.emptyText}>Gracias por ayudar a mejorar el barrio. Ya puedes consultar el estado desde Mis Reportes.</Text>
                            <Pressable accessibilityRole="button" onPress={goToReports} style={[styles.button, styles.buttonPrimary]}>
                                <Text style={styles.buttonText}>Ir a mis reportes</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Datos del problema</Text>
                                <View style={styles.field}>
                                    <Text style={styles.label}>Título</Text>
                                    <TextInput
                                        accessibilityLabel="Título del reclamo"
                                        value={draft.titulo}
                                        onChangeText={(value) => updateDraft('titulo', value)}
                                        placeholder="Ej.: Luminaria apagada"
                                        placeholderTextColor="#8293A5"
                                        maxLength={80}
                                        editable={!isBusy}
                                        style={fieldStyle('titulo')}
                                    />
                                    {!!errors.titulo && <Text style={styles.fieldError}>{errors.titulo}</Text>}
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Descripción</Text>
                                    <TextInput
                                        accessibilityLabel="Descripción del reclamo"
                                        value={draft.descripcion}
                                        onChangeText={(value) => updateDraft('descripcion', value)}
                                        placeholder="Agrega detalles que ayuden a identificar el problema."
                                        placeholderTextColor="#8293A5"
                                        maxLength={1000}
                                        multiline
                                        editable={!isBusy}
                                        style={[fieldStyle('descripcion'), styles.textArea]}
                                    />
                                    {!!errors.descripcion && <Text style={styles.fieldError}>{errors.descripcion}</Text>}
                                    <Text style={styles.fieldHint}>{draft.descripcion.length}/1000 caracteres</Text>
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Categoría</Text>
                                    <CategorySelector
                                        value={draft.categoria}
                                        onChange={(value) => updateDraft('categoria', value)}
                                        disabled={isBusy}
                                    />
                                    {!!errors.categoria && <Text style={styles.fieldError}>{errors.categoria}</Text>}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Ubicación</Text>
                                <View style={styles.locationBox}>
                                    {draft.coordenadas ? (
                                        <Text style={styles.locationValue}>
                                            {draft.coordenadas.latitude.toFixed(5)}, {draft.coordenadas.longitude.toFixed(5)}
                                        </Text>
                                    ) : (
                                        <Text style={styles.fieldHint}>Todavía no se agregó una ubicación.</Text>
                                    )}
                                    <Text style={styles.fieldHint}>La ubicación es opcional. Puedes enviar el reclamo sin coordenadas.</Text>
                                    <Pressable
                                        accessibilityRole="button"
                                        disabled={isBusy}
                                        onPress={detectLocation}
                                        style={[styles.button, styles.buttonSecondary, isBusy && styles.buttonDisabled]}
                                    >
                                        {busy === 'location' ? (
                                            <ActivityIndicator color={reportColors.primaryDark} />
                                        ) : (
                                            <Text style={styles.buttonTextSecondary}>
                                                {draft.coordenadas ? 'Actualizar ubicación' : 'Detectar mi ubicación'}
                                            </Text>
                                        )}
                                    </Pressable>
                                    {!!errors.coordenadas && <Text style={styles.fieldError}>{errors.coordenadas}</Text>}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Foto de evidencia (opcional)</Text>
                                {draft.fotoUri ? (
                                    <Image source={{ uri: draft.fotoUri }} style={styles.photoPreview} resizeMode="cover" accessibilityLabel="Vista previa de la evidencia" />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <Text style={styles.photoPlaceholderTitle}>Agrega una fotografía</Text>
                                        <Text style={styles.photoPlaceholderText}>La imagen se guarda como URI local en este MVP.</Text>
                                    </View>
                                )}
                                <View style={styles.row}>
                                    <Pressable
                                        accessibilityRole="button"
                                        disabled={isBusy}
                                        onPress={() => choosePhoto(takePhoto, 'camera')}
                                        style={[styles.button, styles.buttonSecondary, isBusy && styles.buttonDisabled]}
                                    >
                                        {busy === 'camera' ? <ActivityIndicator color={reportColors.primaryDark} /> : <Text style={styles.buttonTextSecondary}>Tomar foto</Text>}
                                    </Pressable>
                                    <Pressable
                                        accessibilityRole="button"
                                        disabled={isBusy}
                                        onPress={() => choosePhoto(pickImage, 'gallery')}
                                        style={[styles.button, styles.buttonSecondary, isBusy && styles.buttonDisabled]}
                                    >
                                        {busy === 'gallery' ? <ActivityIndicator color={reportColors.primaryDark} /> : <Text style={styles.buttonTextSecondary}>Elegir de galería</Text>}
                                    </Pressable>
                                    {!!draft.fotoUri && (
                                        <Pressable
                                            accessibilityRole="button"
                                            disabled={isBusy}
                                            onPress={() => updateDraft('fotoUri', null)}
                                            style={[styles.button, styles.buttonDanger]}
                                        >
                                            <Text style={styles.buttonTextDanger}>Quitar foto</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>

                            <Pressable
                                accessibilityRole="button"
                                disabled={isBusy}
                                onPress={submitReport}
                                style={[styles.button, styles.buttonPrimary, { minHeight: 54 }, isBusy && styles.buttonDisabled]}
                            >
                                {busy === 'submit' ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Publicar reclamo</Text>
                                )}
                            </Pressable>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
