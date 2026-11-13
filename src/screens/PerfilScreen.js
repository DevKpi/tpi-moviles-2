import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import LoadingState from '../components/LoadingState';
import ScreenHeader from '../components/ScreenHeader';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../firebase/authService';
import {
    pickImage,
    showImageSourceOptions,
    takePhoto,
} from '../services/ImageService';
import {
    eliminarImagenPerfil,
    guardarImagenPerfil,
    obtenerImagenPerfil,
} from '../services/storageService';
import { getUser } from '../services/userService';
import { getReportErrorMessage } from '../utils/reportErrorMessages';
import { urbanPerfilStyles as styles } from '../styles/UrbanPerfilStyles';

export default function PerfilScreen({ navigation, onLogout }) {
    const authContext = useContext(AuthContext);
    const user = authContext?.user || null;

    const [profileData, setProfileData] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [updatingImage, setUpdatingImage] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadAccountInfo = async () => {
            setLoadingProfile(true);
            setErrorMessage('');

            try {
                const storedAvatar = await obtenerImagenPerfil(user?.uid);
                if (isMounted && storedAvatar) {
                    setAvatarUri(storedAvatar);
                }

                if (user?.uid) {
                    const remoteProfile = await getUser(user.uid);
                    if (isMounted && remoteProfile) {
                        setProfileData(remoteProfile);
                    }
                }
            } catch {
                if (isMounted) {
                    setErrorMessage('No se pudo recuperar toda la información del perfil.');
                }
            } finally {
                if (isMounted) {
                    setLoadingProfile(false);
                }
            }
        };

        loadAccountInfo();

        return () => {
            isMounted = false;
        };
    }, [user?.uid]);

    const applyNewAvatar = async (uri) => {
        if (!uri) return;
        setUpdatingImage(true);
        setErrorMessage('');
        try {
            await guardarImagenPerfil(uri, user?.uid);
            setAvatarUri(uri);
        } catch {
            setErrorMessage('No se pudo guardar la foto de perfil en el dispositivo.');
        } finally {
            setUpdatingImage(false);
        }
    };

    const handlePickFromGallery = async () => {
        if (updatingImage) return;
        setUpdatingImage(true);
        setErrorMessage('');
        try {
            const uri = await pickImage();
            if (uri) {
                await guardarImagenPerfil(uri, user?.uid);
                setAvatarUri(uri);
            }
        } catch (error) {
            setErrorMessage(
                getReportErrorMessage(error, 'Ocurrió un error al seleccionar la imagen de la galería.')
            );
        } finally {
            setUpdatingImage(false);
        }
    };

    const handleTakePhoto = async () => {
        if (updatingImage) return;
        setUpdatingImage(true);
        setErrorMessage('');
        try {
            const uri = await takePhoto();
            if (uri) {
                await guardarImagenPerfil(uri, user?.uid);
                setAvatarUri(uri);
            }
        } catch (error) {
            setErrorMessage(
                getReportErrorMessage(error, 'Ocurrió un error al capturar la fotografía con la cámara.')
            );
        } finally {
            setUpdatingImage(false);
        }
    };

    const handleAvatarPress = () => {
        if (updatingImage) return;
        if (Platform.OS === 'web') {
            handlePickFromGallery();
            return;
        }
        showImageSourceOptions(
            async (uri) => {
                await applyNewAvatar(uri);
            },
            {
                title: 'Foto de Perfil',
                onError: (error) => {
                    setErrorMessage(
                        getReportErrorMessage(error, 'No se pudo obtener la fotografía seleccionada.')
                    );
                },
            }
        );
    };

    const handleRemoveAvatar = async () => {
        if (updatingImage || !avatarUri) return;
        setUpdatingImage(true);
        setErrorMessage('');
        try {
            await eliminarImagenPerfil(user?.uid);
            setAvatarUri(null);
        } catch {
            setErrorMessage('No se pudo eliminar la foto de perfil guardada.');
        } finally {
            setUpdatingImage(false);
        }
    };

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            const logoutFn = onLogout || logout;
            await logoutFn();
        } catch {
            Alert.alert('Error', 'No se pudo cerrar la sesión.');
        } finally {
            setLoggingOut(false);
        }
    };

    const handleBack = () => {
        if (navigation?.canGoBack?.()) {
            navigation.goBack();
        } else {
            navigation?.navigate?.('Inicio');
        }
    };

    const displayName =
        profileData?.nombre ||
        user?.displayName ||
        (user?.email ? user.email.split('@')[0] : 'Usuario UrbanAlert');

    const displayEmail = profileData?.email || user?.email || 'Sin correo disponible';
    const displayUid = user?.uid || 'Sesión local';
    const initial = displayName.charAt(0).toUpperCase();

    if (loadingProfile) {
        return <LoadingState message="Cargando perfil de usuario..." />;
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                badge="Perfil Ciudadano"
                title="Mi Cuenta"
                subtitle="Consulta tu información de usuario y personaliza tu foto de perfil."
                onBack={navigation ? handleBack : undefined}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarCard}>
                    <Pressable
                        testID="perfil-avatar-button"
                        accessibilityRole="button"
                        onPress={handleAvatarPress}
                        disabled={updatingImage}
                        style={({ pressed }) => [
                            styles.avatarButton,
                            pressed && { opacity: 0.85 },
                        ]}
                    >
                        {avatarUri ? (
                            <Image
                                testID="perfil-avatar-image"
                                source={{ uri: avatarUri }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <Text style={styles.avatarInitials}>{initial}</Text>
                        )}
                    </Pressable>

                    <Text style={styles.avatarName}>{displayName}</Text>
                    <Text style={styles.avatarEmail}>{displayEmail}</Text>
                    <Text style={styles.avatarHint}>
                        Toca el círculo o usa los botones para cambiar tu foto de perfil
                    </Text>

                    <View style={styles.avatarActionsRow}>
                        <View style={styles.avatarActionItem}>
                            <CustomButton
                                testID="perfil-gallery-button"
                                title="🖼️ Galería"
                                variant="secondary"
                                loading={updatingImage}
                                onPress={handlePickFromGallery}
                            />
                        </View>
                        <View style={styles.avatarActionItem}>
                            <CustomButton
                                testID="perfil-camera-button"
                                title="📷 Cámara"
                                variant="primary"
                                loading={updatingImage}
                                onPress={handleTakePhoto}
                            />
                        </View>
                    </View>
                </View>

                {errorMessage ? (
                    <Text style={styles.feedbackText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Información de la cuenta</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nombre de usuario</Text>
                        <Text style={styles.infoValue}>{displayName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Correo electrónico</Text>
                        <Text style={styles.infoValue}>{displayEmail}</Text>
                    </View>

                    <View style={styles.infoRowLast}>
                        <Text style={styles.infoLabel}>Identificador de cuenta (UID)</Text>
                        <Text style={styles.infoValueMono}>{displayUid}</Text>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    {avatarUri ? (
                        <CustomButton
                            testID="perfil-remove-avatar-button"
                            title="Quitar foto de perfil"
                            variant="ghost"
                            disabled={updatingImage}
                            onPress={handleRemoveAvatar}
                        />
                    ) : null}

                    <CustomButton
                        testID="perfil-logout-button"
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
