import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import ReportCard from '../components/ReportCard';
import { REPORT_STATUS, isValidCoordinates } from '../constants/reportConstants';
import { AuthContext } from '../context/AuthContext';
import { getAllReports } from '../services/reportService';
import { getCurrentLocation } from '../services/locationService';
import { formatReportDate } from '../services/reportValidation';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { reportColors, reportStyles } from '../styles/ReportStyles';
import { mapStyles as styles } from '../styles/MapStyles';

const defaultRegion = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
};

const markerColors = {
    [REPORT_STATUS.PENDING]: '#D18B00',
    [REPORT_STATUS.UNDER_REVIEW]: '#3478C5',
    [REPORT_STATUS.RESOLVED]: '#32865A',
    [REPORT_STATUS.CANCELLED]: '#768391',
};

export default function MapScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const mapRef = useRef(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [detailReport, setDetailReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const loadReports = useCallback(async () => {
        if (!user?.uid) {
            setReports([]);
            setErrorMessage(getReportErrorMessage({ code: 'AUTH_REQUIRED' }));
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage('');
        try {
            const results = await getAllReports();
            setReports(results);
            setSelectedReport((current) => current ? results.find((report) => report.id === current.id) || null : null);
        } catch (error) {
            setErrorMessage(getReportErrorMessage(error, 'No se pudieron cargar los reportes del mapa.'));
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [loadReports])
    );

    const geolocatedReports = useMemo(
        () => reports.filter((report) => report.coordenadas && isValidCoordinates(report.coordenadas)),
        [reports]
    );

    useEffect(() => {
        if (!selectedReport) return;
        const coordinate = selectedReport.coordenadas;
        if (!coordinate || !isValidCoordinates(coordinate)) return;
        mapRef.current?.animateToRegion({
            ...coordinate,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
        }, 350);
    }, [selectedReport]);

    const centerOnCurrentLocation = async () => {
        setLocating(true);
        setErrorMessage('');
        try {
            const location = await getCurrentLocation();
            mapRef.current?.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.035,
                longitudeDelta: 0.035,
            }, 400);
        } catch (error) {
            setErrorMessage(getReportErrorMessage(error, 'No se pudo obtener tu ubicación.'));
        } finally {
            setLocating(false);
        }
    };

    const markerColor = (status) => markerColors[status] || reportColors.primary;

    const goBack = () => {
        if (navigation?.canGoBack?.()) navigation.goBack();
        else navigation?.navigate?.('Inicio');
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.headerCopy}>
                    <Text style={styles.title}>Mapa de reportes</Text>
                    <Text style={styles.subtitle}>{geolocatedReports.length} reportes con ubicación</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <BackButton onPress={goBack} />
                    <Pressable accessibilityRole="button" onPress={loadReports} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Actualizar</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.mapContainer}>
                <MapView ref={mapRef} initialRegion={defaultRegion} style={styles.map}>
                    {geolocatedReports.map((report) => (
                        <Marker
                            key={report.id}
                            coordinate={report.coordenadas}
                            pinColor={markerColor(report.estado)}
                            onPress={() => setSelectedReport(report)}
                            accessibilityLabel={`Reporte ${report.titulo}, estado ${report.estado}`}
                        >
                            <Callout onPress={() => setSelectedReport(report)}>
                                <View style={{ width: 210, gap: 4, padding: 4 }}>
                                    <Text style={{ color: '#14263D', fontWeight: '800' }}>{report.titulo}</Text>
                                    <Text style={{ color: '#60738A', fontSize: 12 }}>{report.categoria} · {report.estado}</Text>
                                    <Text style={{ color: '#60738A', fontSize: 11 }}>{formatReportDate(report.fechaCreacion)}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                <View style={styles.overlay}>
                    {loading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                            <ActivityIndicator color={reportColors.primary} />
                            <Text style={styles.overlayText}>Cargando reportes…</Text>
                        </View>
                    ) : errorMessage ? (
                        <View style={{ gap: 8 }}>
                            <Text accessibilityRole="alert" style={styles.overlayText}>{errorMessage}</Text>
                            <Pressable accessibilityRole="button" onPress={loadReports} style={[styles.actionButton, { alignSelf: 'flex-start' }]}>
                                <Text style={styles.actionButtonText}>Reintentar</Text>
                            </Pressable>
                        </View>
                    ) : geolocatedReports.length === 0 ? (
                        <Text style={styles.overlayText}>Todavía no hay reportes con coordenadas. Puedes actualizar para volver a consultar.</Text>
                    ) : (
                        <Text style={styles.overlayText}>Toca un marcador para ver el detalle del incidente.</Text>
                    )}
                </View>

                <Pressable accessibilityRole="button" onPress={centerOnCurrentLocation} style={[styles.actionButton, { position: 'absolute', right: 14, top: 92 }]}>
                    {locating ? <ActivityIndicator color={reportColors.primaryDark} /> : <Text style={styles.actionButtonText}>Mi ubicación</Text>}
                </Pressable>

                {selectedReport && (
                    <View style={styles.selectedCard}>
                        <View style={{ backgroundColor: reportColors.surface, borderRadius: 16, padding: 14, gap: 8, borderWidth: 1, borderColor: reportColors.border }}>
                            <Text style={{ color: reportColors.ink, fontSize: 16, fontWeight: '800' }}>{selectedReport.titulo}</Text>
                            <Text style={{ color: reportColors.muted, fontSize: 12 }}>{selectedReport.categoria} · {selectedReport.estado}</Text>
                            {!!selectedReport.descripcion && (
                                <Text numberOfLines={3} style={{ color: reportColors.muted, fontSize: 13, lineHeight: 18 }}>{selectedReport.descripcion}</Text>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setSelectedReport(null)}
                                    style={[reportStyles.button, reportStyles.buttonOutline, { minHeight: 40, paddingHorizontal: 14 }]}
                                >
                                    <Text style={reportStyles.buttonTextSecondary}>Cerrar</Text>
                                </Pressable>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setDetailReport(selectedReport)}
                                    style={[reportStyles.button, reportStyles.buttonPrimary, { minHeight: 40, paddingHorizontal: 14 }]}
                                >
                                    <Text style={reportStyles.buttonText}>Ver reporte completo</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <Modal visible={!!detailReport} transparent animationType="fade" onRequestClose={() => setDetailReport(null)}>
                <View style={reportStyles.modalOverlay}>
                    <View style={reportStyles.modalContent}>
                        <Text style={reportStyles.sectionTitle}>Detalle del incidente</Text>
                        {detailReport && (
                            <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
                                {detailReport.fotoUri ? (
                                    <Image
                                        source={{ uri: detailReport.fotoUri }}
                                        style={reportStyles.photoPreview}
                                        resizeMode="cover"
                                        accessibilityLabel="Fotografía del incidente"
                                    />
                                ) : (
                                    <View style={reportStyles.photoPlaceholder}>
                                        <Text style={reportStyles.photoPlaceholderTitle}>Sin fotografía adjunta</Text>
                                        <Text style={reportStyles.photoPlaceholderText}>Este reporte no incluye imagen de evidencia.</Text>
                                    </View>
                                )}
                                <ReportCard report={detailReport} showPhoto={false} />
                            </ScrollView>
                        )}
                        <View style={[reportStyles.row, { justifyContent: 'flex-end' }]}>
                            {detailReport?.userId === user?.uid && (
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => {
                                        setDetailReport(null);
                                        navigation?.navigate?.('MisReportes');
                                    }}
                                    style={[reportStyles.button, reportStyles.buttonSecondary]}
                                >
                                    <Text style={reportStyles.buttonTextSecondary}>Ir a Mis reportes</Text>
                                </Pressable>
                            )}
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => setDetailReport(null)}
                                style={[reportStyles.button, reportStyles.buttonPrimary]}
                            >
                                <Text style={reportStyles.buttonText}>Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
