import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import ScreenHeader from '../components/ScreenHeader';
import * as AddReportModule from '../screens/AddReportScreen';
import HomeScreen from '../screens/HomeScreen';
import * as MapModule from '../screens/MapScreen';
import PerfilScreen from '../screens/PerfilScreen';
import * as ReportsModule from '../screens/ReportsScreen';
import { COLORS, commonStyles, SPACING } from '../styles/CommonStyles';

export const APP_ROUTES = {
    INICIO: 'Inicio',
    NUEVO_REPORTE: 'NuevoReporte',
    MIS_REPORTES: 'MisReportes',
    MAPA: 'Mapa',
    PERFIL: 'Perfil',
};

const Stack = createNativeStackNavigator();

/**
 * Envuelve las pantallas de otros módulos para evitar fallos en React Navigation
 * si el archivo correspondiente aún está vacío antes de la integración de ramas.
 */
const resolveScreenComponent = (moduleNamespace, title, subtitle) => {
    const candidate = moduleNamespace?.default || moduleNamespace;
    if (typeof candidate === 'function') {
        return candidate;
    }

    return function PendingModuleScreen({ navigation }) {
        return (
            <View style={commonStyles.screenContainer}>
                <ScreenHeader
                    badge="UrbanAlert"
                    title={title}
                    subtitle={subtitle}
                    onBack={() => navigation?.navigate(APP_ROUTES.INICIO)}
                />
                <View style={commonStyles.scrollContent}>
                    <View style={commonStyles.card}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING.md,
                                lineHeight: 22,
                            }}
                        >
                            Esta sección está registrada en la navegación de UrbanAlert y se activará automáticamente al integrar el módulo correspondiente.
                        </Text>
                        <CustomButton
                            title="Volver al Inicio"
                            variant="secondary"
                            onPress={() => navigation?.navigate(APP_ROUTES.INICIO)}
                        />
                    </View>
                </View>
            </View>
        );
    };
};

const ResolvedAddReportScreen = resolveScreenComponent(
    AddReportModule,
    'Nuevo Reporte',
    'Formulario de alta de reclamos e incidentes urbanos.'
);

const ResolvedReportsScreen = resolveScreenComponent(
    ReportsModule,
    'Mis Reportes',
    'Listado y seguimiento de reclamos registrados.'
);

const ResolvedMapScreen = resolveScreenComponent(
    MapModule,
    'Mapa de Incidentes',
    'Visualización geográfica de los reportes urbanos.'
);

export default function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName={APP_ROUTES.INICIO}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name={APP_ROUTES.INICIO} component={HomeScreen} />
            <Stack.Screen name={APP_ROUTES.NUEVO_REPORTE} component={ResolvedAddReportScreen} />
            <Stack.Screen name={APP_ROUTES.MIS_REPORTES} component={ResolvedReportsScreen} />
            <Stack.Screen name={APP_ROUTES.MAPA} component={ResolvedMapScreen} />
            <Stack.Screen name={APP_ROUTES.PERFIL} component={PerfilScreen} />
        </Stack.Navigator>
    );
}
