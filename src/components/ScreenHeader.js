import { Text, View } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';
import BackButton from './BackButton';

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

                {onBack ? <BackButton onPress={onBack} label={backLabel} /> : null}
            </View>

            {title ? (
                <Text accessibilityRole="header" style={commonStyles.headerTitle}>
                    {title}
                </Text>
            ) : null}
            {subtitle ? <Text style={commonStyles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
    );
}
