import { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import ScreenHeader from '../components/ScreenHeader';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../firebase/authService';
import { urbanHomeStyles as styles } from '../styles/UrbanHomeStyles';

const DASHBOARD_SECTIONS = [
    {
        route: 'NuevoReporte',
        icon: '➕',
        title: 'Nuevo Reporte',
        description: 'Registra un bache, luminaria rota o incidente con ubicación GPS y foto.',
        testID: 'home-nav-nuevo-reporte',
    },
    {
        route: 'MisReportes',
        icon: '📋',
        title: 'Mis Reportes',
        description: 'Consulta el seguimiento, edita o cancela los reclamos que enviaste.',
        testID: 'home-nav-mis-reportes',
    },
    {
        route: 'Mapa',
        icon: '🗺️',
        title: 'Mapa de Incidentes',
        description: 'Visualiza en el mapa interactivo los reclamos registrados en la zona.',
        testID: 'home-nav-mapa',
    },
    {
        route: 'Perfil',
        icon: '👤',
        title: 'Mi Perfil',
        description: 'Consulta los datos de tu cuenta y personaliza tu foto de perfil.',
        testID: 'home-nav-perfil',
    },
];

export default function HomeScreen({ navigation, onLogout }) {
    const authContext = useContext(AuthContext);
    const user = authContext?.user || null;
    const [loggingOut, setLoggingOut] = useState(false);

    const displayName = user?.displayName
        || (user?.email ? user.email.split('@')[0] : 'Vecino');

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            const logoutFn = onLogout || logout;
            await logoutFn();
        } catch {
            Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta nuevamente.');
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                badge="Panel Ciudadano"
                title={`¡Hola, ${displayName}!`}
                subtitle="Gestiona reportes urbanos y colabora con el mantenimiento de tu ciudad."
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcomeCard}>
                    <View style={styles.welcomeBadge}>
                        <Text style={styles.welcomeBadgeText}>UrbanAlert Activo</Text>
                    </View>
                    <Text style={styles.welcomeTitle}>¿Detectaste un incidente en la vía pública?</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Envía un reclamo georreferenciado con evidencia fotográfica en pocos pasos.
                    </Text>

                    <View style={styles.primaryActionWrapper}>
                        <CustomButton
                            testID="home-cta-nuevo-reporte"
                            title="➕ Crear Nuevo Reporte"
                            variant="secondary"
                            onPress={() => navigation?.navigate('NuevoReporte')}
                        />
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Secciones principales</Text>
                    <Text style={styles.sectionSubtitle}>
                        Selecciona una opción para continuar
                    </Text>
                </View>

                <View style={styles.gridContainer}>
                    {DASHBOARD_SECTIONS.map((item) => (
                        <Pressable
                            key={item.route}
                            testID={item.testID}
                            accessibilityRole="button"
                            onPress={() => navigation?.navigate(item.route)}
                            style={({ pressed }) => [
                                styles.navCard,
                                pressed && styles.navCardPressed,
                            ]}
                        >
                            <View style={styles.navCardLeft}>
                                <View style={styles.navIconBox}>
                                    <Text style={styles.navIconText}>{item.icon}</Text>
                                </View>
                                <View style={styles.navTextContainer}>
                                    <Text style={styles.navCardTitle}>{item.title}</Text>
                                    <Text style={styles.navCardDescription}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.navChevron}>→</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.accountSummaryCard}>
                    <Text style={styles.accountSummaryLabel}>Sesión iniciada como</Text>
                    <Text style={styles.accountSummaryValue}>
                        {user?.email || 'Usuario autenticado'}
                    </Text>
                </View>

                <View style={styles.logoutContainer}>
                    <CustomButton
                        testID="home-logout-button"
                        title="Cerrar Sesión"
                        variant="danger"
                        loading={loggingOut}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
