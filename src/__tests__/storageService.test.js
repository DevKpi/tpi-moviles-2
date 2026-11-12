import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  guardarImagenPerfil,
  obtenerImagenPerfil,
  eliminarImagenPerfil,
} from '../services/storageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guarda la URI de perfil asociada al UID y en la clave general', async () => {
    await guardarImagenPerfil('file:///avatar.jpg', 'uid-123');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile_image_uid-123',
      'file:///avatar.jpg'
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile_image',
      'file:///avatar.jpg'
    );
  });

  it('obtiene la URI de perfil por UID cuando existe', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('file:///avatar-uid.jpg');

    const uri = await obtenerImagenPerfil('uid-123');

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile_image_uid-123');
    expect(uri).toBe('file:///avatar-uid.jpg');
  });

  it('elimina las claves de imagen de perfil para el UID y general', async () => {
    await eliminarImagenPerfil('uid-123');

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile_image_uid-123');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile_image');
  });
});
