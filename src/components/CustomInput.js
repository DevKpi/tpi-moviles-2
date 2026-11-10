import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { COLORS, commonStyles } from '../styles/CommonStyles';

/**
 * Campo de texto controlado y reutilizable con etiqueta, mensaje de error y soporte de contraseña.
 */
export default function CustomInput({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    helperText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    multiline = false,
    numberOfLines = 1,
    editable = true,
    containerStyle,
    inputStyle,
    testID,
    ...rest
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordHidden = secureTextEntry && !showPassword;

    return (
        <View style={[commonStyles.inputWrapper, containerStyle]}>
            {label ? <Text style={commonStyles.inputLabel}>{label}</Text> : null}

            <View
                style={[
                    commonStyles.inputContainer,
                    isFocused && commonStyles.inputContainerFocused,
                    Boolean(error) && commonStyles.inputContainerError,
                ]}
            >
                <TextInput
                    testID={testID}
                    style={[
                        commonStyles.inputField,
                        multiline && commonStyles.inputFieldMultiline,
                        inputStyle,
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={isPasswordHidden}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={editable}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                />

                {secureTextEntry ? (
                    <Pressable
                        onPress={() => setShowPassword((prev) => !prev)}
                        hitSlop={8}
                        style={commonStyles.inputToggleButton}
                    >
                        <Text style={commonStyles.inputToggleText}>
                            {showPassword ? 'Ocultar' : 'Ver'}
                        </Text>
                    </Pressable>
                ) : null}
            </View>

            {error ? (
                <Text style={commonStyles.inputErrorText}>{error}</Text>
            ) : helperText ? (
                <Text style={commonStyles.inputHelperText}>{helperText}</Text>
            ) : null}
        </View>
    );
}
