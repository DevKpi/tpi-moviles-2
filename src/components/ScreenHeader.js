import { Pressable, Text, View } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';

/**
 * Encabezado reutilizable para las pantallas de UrbanAlert.
 */
export default function ScreenHeader({
    badge = 'UrbanAlert',
    title,
    subtitle,
    onBack,
    backLabel = '← Volver',
}) {
    return (
        <View style={commonStyles.headerContainer}>
            <View style={commonStyles.headerTopRow}>
                {badge ? (
                    <View style={commonStyles.headerBadge}>
                        <Text style={commonStyles.headerBadgeText}>{badge}</Text>
                    </View>
                ) : <View />}

                {onBack ? (
                    <Pressable
                        onPress={onBack}
                        hitSlop={10}
                        style={commonStyles.headerBackButton}
                        accessibilityRole="button"
                    >
                        <Text style={commonStyles.headerBackText}>{backLabel}</Text>
                    </Pressable>
                ) : null}
            </View>

            {title ? <Text style={commonStyles.headerTitle}>{title}</Text> : null}
            {subtitle ? <Text style={commonStyles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
    );
}
