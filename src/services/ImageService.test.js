jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
}));

import * as ImagePicker from 'expo-image-picker';
import { pickImage, takePhoto } from './ImageService';

describe('ImageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true, status: 'granted' });
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true, status: 'granted' });
    });

    it('devuelve la URI de la imagen seleccionada en galería', async () => {
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'file:///evidencia.jpg' }],
        });

        await expect(pickImage()).resolves.toBe('file:///evidencia.jpg');
        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('devuelve null si la persona cancela la galería', async () => {
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });

        await expect(pickImage()).resolves.toBeNull();
    });

    it('rechaza la selección de galería cuando se deniega el permiso', async () => {
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false, status: 'denied' });

        await expect(pickImage()).rejects.toMatchObject({ code: 'IMAGE_LIBRARY_PERMISSION_DENIED' });
        expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    });

    it('solicita permiso de cámara antes de abrirla', async () => {
        ImagePicker.launchCameraAsync.mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'file:///camera.jpg' }],
        });

        await expect(takePhoto()).resolves.toBe('file:///camera.jpg');
        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
    });
});
