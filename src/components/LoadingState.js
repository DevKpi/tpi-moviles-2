import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS, commonStyles } from '../styles/CommonStyles';

/**
 * Estado de carga reutilizable para operaciones asíncronas o verificación de sesión.
 */
export default function LoadingState({
    message = 'Cargando información...',
    color = COLORS.primary,
    size = 'large',
}) {
    return (
        <View style={commonStyles.loadingWrapper}>
            <ActivityIndicator size={size} color={color} />
            {message ? <Text style={commonStyles.loadingMessage}>{message}</Text> : null}
        </View>
    );
}
