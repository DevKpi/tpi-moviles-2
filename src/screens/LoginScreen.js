import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { login, resetPassword } from '../firebase/authService';
import { urbanAuthStyles as styles } from '../styles/UrbanAuthStyles';

const AUTH_ERROR_MESSAGES = {
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/invalid-credential': 'El correo o la contraseña son incorrectos.',
    'auth/user-not-found': 'No existe una cuenta registrada con este correo.',
    'auth/wrong-password': 'La contraseña ingresada es incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = ({ email, password }) => {
    const errors = {};
    const trimmedEmail = (email || '').trim();

    if (!trimmedEmail) {
        errors.email = 'Ingresa tu correo electrónico.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Ingresa un correo electrónico con formato válido.';
    }

    if (!password) {
        errors.password = 'Ingresa tu contraseña.';
    } else if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default function LoginScreen({ navigation, onLogin, onResetPassword }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleEmailChange = (value) => {
        setEmail(value);
        if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: null }));
        }
        if (errorMessage) setErrorMessage('');
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: null }));
        }
        if (errorMessage) setErrorMessage('');
    };

    const handleLogin = async () => {
        if (loading) return;

        setInfoMessage('');
        setErrorMessage('');

        const validation = validateLoginForm({ email, password });
        if (!validation.isValid) {
            setFieldErrors(validation.errors);
            return;
        }

        setFieldErrors({});
        setLoading(true);

        try {
            const submitFn = onLogin || login;
            await submitFn(email.trim(), password);
        } catch (error) {
            const friendlyMessage =
                AUTH_ERROR_MESSAGES[error?.code] ||
                'No se pudo iniciar sesión. Verifica tus datos e intenta nuevamente.';
            setErrorMessage(friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (loading || resetting) return;

        setInfoMessage('');
        setErrorMessage('');

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
            setFieldErrors((prev) => ({
                ...prev,
                email: 'Ingresa un correo electrónico válido para recuperar tu clave.',
            }));
            return;
        }

        setResetting(true);
        try {
            const resetFn = onResetPassword || resetPassword;
            await resetFn(trimmedEmail);
            const msg = 'Te enviamos un enlace a tu correo para restablecer tu contraseña.';
            setInfoMessage(msg);
            if (Platform.OS !== 'web') {
                Alert.alert('Correo enviado', msg);
            }
        } catch (error) {
            const friendlyMessage =
                AUTH_ERROR_MESSAGES[error?.code] ||
                'No se pudo enviar el correo de recuperación.';
            setErrorMessage(friendlyMessage);
        } finally {
            setResetting(false);
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
                        <Text style={styles.brandBadgeText}>UrbanAlert</Text>
                    </View>
                    <Text style={styles.title}>Iniciar sesión</Text>
                    <Text style={styles.subtitle}>
                        Accede para reportar y dar seguimiento a incidentes urbanos en tu comunidad.
                    </Text>
                </View>

                <View style={styles.formCard}>
                    {errorMessage ? (
                        <View style={[styles.feedbackBanner, styles.errorBanner]}>
                            <Text style={styles.errorBannerText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    {infoMessage ? (
                        <View style={[styles.feedbackBanner, styles.infoBanner]}>
                            <Text style={styles.infoBannerText}>{infoMessage}</Text>
                        </View>
                    ) : null}

                    <CustomInput
                        testID="login-email-input"
                        label="Correo electrónico"
                        placeholder="vecino@correo.com"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        error={fieldErrors.email}
                    />

                    <CustomInput
                        testID="login-password-input"
                        label="Contraseña"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!loading}
                        error={fieldErrors.password}
                    />

                    <Pressable
                        onPress={handleForgotPassword}
                        disabled={loading || resetting}
                        style={styles.forgotPasswordButton}
                        hitSlop={8}
                    >
                        <Text style={styles.forgotPasswordText}>
                            {resetting ? 'Enviando enlace...' : '¿Olvidaste tu contraseña?'}
                        </Text>
                    </Pressable>

                    <CustomButton
                        testID="login-submit-button"
                        title="Ingresar a UrbanAlert"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading || resetting}
                        style={styles.submitButton}
                    />
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿Aún no tienes una cuenta?</Text>
                    <Pressable
                        onPress={() => navigation?.navigate('Registro')}
                        disabled={loading}
                        hitSlop={8}
                    >
                        <Text style={styles.footerLinkText}>Regístrate aquí</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
