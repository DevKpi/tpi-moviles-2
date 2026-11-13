import { Pressable, Text } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';

/**
 * Botón de retorno unificado para todas las pantallas de UrbanAlert.
 */
export default function BackButton({ onPress, label = '← Volver', style }) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={({ pressed }) => [
                commonStyles.headerBackButton,
                pressed && commonStyles.headerBackButtonPressed,
                style,
            ]}
        >
            <Text style={commonStyles.headerBackText}>{label}</Text>
        </Pressable>
    );
}
