import { ActivityIndicator, Pressable, Text } from 'react-native';
import { COLORS, commonStyles } from '../styles/CommonStyles';

/**
 * Botón reutilizable para UrbanAlert.
 * Variantes soportadas: 'primary' | 'secondary' | 'danger' | 'ghost'
 */
export default function CustomButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    testID,
}) {
    const isDisabled = disabled || loading;

    const variantStyles = {
        primary: commonStyles.buttonPrimary,
        secondary: commonStyles.buttonSecondary,
        danger: commonStyles.buttonDanger,
        ghost: commonStyles.buttonGhost,
    };

    const variantTextStyles = {
        primary: commonStyles.buttonTextPrimary,
        secondary: commonStyles.buttonTextSecondary,
        danger: commonStyles.buttonTextDanger,
        ghost: commonStyles.buttonTextGhost,
    };

    const spinnerColor = variant === 'primary' ? COLORS.white : COLORS.primary;

    return (
        <Pressable
            testID={testID}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                commonStyles.buttonBase,
                variantStyles[variant] || commonStyles.buttonPrimary,
                isDisabled && commonStyles.buttonDisabled,
                pressed && !isDisabled && commonStyles.buttonPressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={spinnerColor} />
            ) : (
                <Text
                    style={[
                        commonStyles.buttonTextBase,
                        variantTextStyles[variant] || commonStyles.buttonTextPrimary,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}
