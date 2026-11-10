import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const imageError = (code, cause) => {
    const error = new Error(code);
    error.code = code;
    if (cause) error.cause = cause;
    return error;
};

const requirePermission = async (requestPermission, deniedCode) => {
    let permission;
    try {
        permission = await requestPermission();
    } catch (error) {
        throw imageError('IMAGE_PERMISSION_UNAVAILABLE', error);
    }

    if (!permission || (!permission.granted && permission.status !== 'granted')) {
        throw imageError(deniedCode);
    }
};

const getFirstImageUri = (result) => {
    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0]?.uri || null;
};

export const pickImage = async (options = {}) => {
    await requirePermission(
        ImagePicker.requestMediaLibraryPermissionsAsync,
        'IMAGE_LIBRARY_PERMISSION_DENIED'
    );

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.85,
            ...options,
        });
        return getFirstImageUri(result);
    } catch (error) {
        throw imageError('IMAGE_LIBRARY_UNAVAILABLE', error);
    }
};

export const takePhoto = async (options = {}) => {
    await requirePermission(ImagePicker.requestCameraPermissionsAsync, 'IMAGE_CAMERA_PERMISSION_DENIED');

    try {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.85,
            ...options,
        });
        return getFirstImageUri(result);
    } catch (error) {
        throw imageError('IMAGE_CAMERA_UNAVAILABLE', error);
    }
};

export const showImageSourceOptions = (onImagePicked, { onError, title = 'Agregar fotografía' } = {}) => {
    const chooseImage = async (picker) => {
        try {
            const uri = await picker();
            if (uri && typeof onImagePicked === 'function') onImagePicked(uri);
        } catch (error) {
            if (typeof onError === 'function') onError(error);
        }
    };

    Alert.alert(title, 'Elige cómo quieres agregar la fotografía.', [
        { text: 'Tomar fotografía', onPress: () => chooseImage(takePhoto) },
        { text: 'Elegir de galería', onPress: () => chooseImage(pickImage) },
        { text: 'Cancelar', style: 'cancel' },
    ]);
};

export const seleccionarImagen = pickImage;
export const tomarFoto = takePhoto;

export default {
    pickImage,
    takePhoto,
    showImageSourceOptions,
    seleccionarImagen,
    tomarFoto,
};
