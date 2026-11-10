import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { REPORT_STATUS, isValidCoordinates } from '../constants/reportConstants';
import { AuthContext } from '../context/AuthContext';
import { getAllReports } from '../services/reportService';
import { getCurrentLocation } from '../services/locationService';
import { formatReportDate } from '../services/reportValidation';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { reportColors } from '../styles/ReportStyles';
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

export default function MapScreen() {
    const { user } = useContext(AuthContext);
    const mapRef = useRef(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
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

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.headerCopy}>
                    <Text style={styles.title}>Mapa de reportes</Text>
                    <Text style={styles.subtitle}>{geolocatedReports.length} reportes con ubicación</Text>
                </View>
                <Pressable accessibilityRole="button" onPress={loadReports} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Actualizar</Text>
                </Pressable>
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
                        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 6 }}>
                            <Text style={{ color: '#14263D', fontSize: 16, fontWeight: '800' }}>{selectedReport.titulo}</Text>
                            <Text style={{ color: '#60738A', fontSize: 12 }}>{selectedReport.categoria} · {selectedReport.estado}</Text>
                            {!!selectedReport.descripcion && (
                                <Text numberOfLines={3} style={{ color: '#354C62', fontSize: 13, lineHeight: 18 }}>{selectedReport.descripcion}</Text>
                            )}
                            <Pressable accessibilityRole="button" onPress={() => setSelectedReport(null)} style={[styles.actionButton, { alignSelf: 'flex-end' }]}>
                                <Text style={styles.actionButtonText}>Cerrar detalle</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
