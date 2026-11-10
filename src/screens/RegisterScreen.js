import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { register } from '../firebase/authService';
import { saveUserData } from '../services/userService';
import { urbanAuthStyles as styles } from '../styles/UrbanAuthStyles';

const REGISTER_ERROR_MESSAGES = {
    'auth/email-already-in-use': 'Ya existe una cuenta registrada con ese correo electrónico.',
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/weak-password': 'La contraseña es muy débil. Usa al menos 6 caracteres.',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterForm = ({ nombre, email, password, confirmPassword }) => {
    const errors = {};
    const trimmedName = (nombre || '').trim();
    const trimmedEmail = (email || '').trim();

    if (!trimmedName) {
        errors.nombre = 'Ingresa tu nombre completo.';
    } else if (trimmedName.length < 2) {
        errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!trimmedEmail) {
        errors.email = 'Ingresa tu correo electrónico.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Ingresa un correo electrónico con formato válido.';
    }

    if (!password) {
        errors.password = 'Crea una contraseña para tu cuenta.';
    } else if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (confirmPassword !== undefined) {
        if (!confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña.';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default function RegisterScreen({ navigation, onRegister }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const clearFieldError = (field) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: null }));
        }
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const handleRegister = async () => {
        if (loading) return;

        setErrorMessage('');

        const validation = validateRegisterForm({
            nombre,
            email,
            password,
            confirmPassword,
        });

        if (!validation.isValid) {
            setFieldErrors(validation.errors);
            return;
        }

        setFieldErrors({});
        setLoading(true);

        try {
            if (onRegister) {
                await onRegister({
                    nombre: nombre.trim(),
                    email: email.trim(),
                    password,
                });
            } else {
                const userCredential = await register(email.trim(), password);
                const createdUser = userCredential?.user;

                if (createdUser?.uid) {
                    try {
                        await saveUserData(createdUser.uid, {
                            userId: createdUser.uid,
                            nombre: nombre.trim(),
                            email: createdUser.email || email.trim(),
                            fotoPerfilUri: null,
                            fechaRegistro: new Date().toISOString(),
                        });
                    } catch {
                        // Si la persistencia de perfil falla, la cuenta de Auth sigue activa.
                    }
                }
            }
        } catch (error) {
            const friendlyMessage =
                REGISTER_ERROR_MESSAGES[error?.code] ||
                'No se pudo completar el registro. Intenta nuevamente.';
            setErrorMessage(friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroContainer}>
                    <View style={styles.brandBadge}>
                        <Text style={styles.brandBadgeText}>Registro Vecinal</Text>
                    </View>
                    <Text style={styles.title}>Crear cuenta</Text>
                    <Text style={styles.subtitle}>
                        Súmate a UrbanAlert para reportar incidentes y mejorar el estado de tu barrio.
                    </Text>
                </View>

                <View style={styles.formCard}>
                    {errorMessage ? (
                        <View style={[styles.feedbackBanner, styles.errorBanner]}>
                            <Text style={styles.errorBannerText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <CustomInput
                        testID="register-name-input"
                        label="Nombre completo"
                        placeholder="Ej: Ana García"
                        value={nombre}
                        onChangeText={(val) => {
                            setNombre(val);
                            clearFieldError('nombre');
                        }}
                        autoCapitalize="words"
                        editable={!loading}
                        error={fieldErrors.nombre}
                    />

                    <CustomInput
                        testID="register-email-input"
                        label="Correo electrónico"
                        placeholder="vecino@correo.com"
                        value={email}
                        onChangeText={(val) => {
                            setEmail(val);
                            clearFieldError('email');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        error={fieldErrors.email}
                    />

                    <CustomInput
                        testID="register-password-input"
                        label="Contraseña"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChangeText={(val) => {
                            setPassword(val);
                            clearFieldError('password');
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!loading}
                        error={fieldErrors.password}
                    />

                    <CustomInput
                        testID="register-confirm-input"
                        label="Confirmar contraseña"
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChangeText={(val) => {
                            setConfirmPassword(val);
                            clearFieldError('confirmPassword');
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!loading}
                        error={fieldErrors.confirmPassword}
                    />

                    <CustomButton
                        testID="register-submit-button"
                        title="Crear mi cuenta"
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading}
                        style={styles.submitButton}
                    />
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                    <Pressable
                        onPress={() => navigation?.navigate('Login')}
                        disabled={loading}
                        hitSlop={8}
                    >
                        <Text style={styles.footerLinkText}>Inicia sesión</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
