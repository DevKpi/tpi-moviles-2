import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReportCard from '../components/ReportCard';
import { isValidCoordinates } from '../constants/reportConstants';
import { AuthContext } from '../context/AuthContext';
import { getAllReports } from '../services/reportService';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { reportColors, reportStyles } from '../styles/ReportStyles';
import { mapStyles } from '../styles/MapStyles';

export default function MapScreenWeb({ navigation }) {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [openingId, setOpeningId] = useState(null);

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
            setReports(await getAllReports());
        } catch (error) {
            setErrorMessage(getReportErrorMessage(error, 'No se pudieron cargar los reportes.'));
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [loadReports])
    );

    useEffect(() => {
        if (openingId && !reports.some((report) => report.id === openingId)) setOpeningId(null);
    }, [openingId, reports]);

    const openInMaps = async (report) => {
        if (!report.coordenadas || !isValidCoordinates(report.coordenadas)) return;
        const { latitude, longitude } = report.coordenadas;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        setOpeningId(report.id);
        setErrorMessage('');
        try {
            await Linking.openURL(url);
        } catch (error) {
            setErrorMessage('No se pudo abrir el servicio de mapas en esta ventana.');
        } finally {
            setOpeningId(null);
        }
    };

    const renderItem = ({ item }) => {
        const hasLocation = item.coordenadas && isValidCoordinates(item.coordenadas);
        return (
            <ReportCard
                report={item}
                showPhoto={false}
                extraAction={
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Pressable
                            accessibilityRole="link"
                            accessibilityState={{ disabled: !hasLocation }}
                            disabled={!hasLocation || openingId === item.id}
                            onPress={() => openInMaps(item)}
                            style={[
                                mapStyles.webLocationButton,
                                !hasLocation && mapStyles.webLocationButtonDisabled,
                            ]}
                        >
                            {openingId === item.id ? (
                                <ActivityIndicator color={reportColors.primary} />
                            ) : (
                                <Text style={[mapStyles.webLocationText, !hasLocation && mapStyles.webLocationTextDisabled]}>
                                    {hasLocation ? 'Abrir en Google Maps ↗' : 'Sin coordenadas'}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                }
            />
        );
    };

    const goBack = () => {
        if (navigation?.canGoBack?.()) navigation.goBack();
        else navigation?.navigate?.('Inicio');
    };

    return (
        <View style={mapStyles.screen}>
            <View style={mapStyles.webContent}>
                <View style={mapStyles.header}>
                    <View style={mapStyles.headerCopy}>
                        <Text style={mapStyles.title}>Mapa de reportes</Text>
                        <Text style={mapStyles.subtitle}>Versión web · {reports.filter((item) => item.coordenadas && isValidCoordinates(item.coordenadas)).length} ubicaciones disponibles</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Pressable accessibilityRole="button" onPress={goBack} style={[reportStyles.button, reportStyles.buttonOutline, { minHeight: 40, paddingHorizontal: 12 }]}>
                            <Text style={reportStyles.buttonTextSecondary}>← Volver</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" onPress={loadReports} style={mapStyles.actionButton}>
                            <Text style={mapStyles.actionButtonText}>Actualizar</Text>
                        </Pressable>
                    </View>
                </View>

                {!!errorMessage && (
                    <View style={{ gap: 8 }}>
                        <Text accessibilityRole="alert" style={[reportStyles.notice, reportStyles.errorNotice]}>{errorMessage}</Text>
                        <Pressable accessibilityRole="button" onPress={loadReports} style={[reportStyles.button, reportStyles.buttonOutline, { alignSelf: 'flex-start' }]}>
                            <Text style={reportStyles.buttonTextSecondary}>Reintentar</Text>
                        </Pressable>
                    </View>
                )}

                {loading ? (
                    <View style={[reportStyles.emptyState, { flex: 1, justifyContent: 'center' }]}>
                        <ActivityIndicator size="large" color={reportColors.primary} />
                        <Text style={reportStyles.emptyText}>Cargando reportes…</Text>
                    </View>
                ) : reports.length === 0 ? (
                    <View style={reportStyles.emptyState}>
                        <Text style={reportStyles.emptyTitle}>Todavía no hay reportes</Text>
                        <Text style={reportStyles.emptyText}>Los reportes con ubicación aparecerán aquí.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={reports}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={mapStyles.webList}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}
