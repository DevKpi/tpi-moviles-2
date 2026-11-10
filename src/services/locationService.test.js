jest.mock('expo-location', () => ({
    Accuracy: { Balanced: 3 },
    hasServicesEnabledAsync: jest.fn(),
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
}));

import * as Location from 'expo-location';
import { getCurrentLocation, watchLocation } from './locationService';

describe('locationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Location.hasServicesEnabledAsync.mockResolvedValue(true);
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    });

    it('obtiene coordenadas tras comprobar GPS y permiso', async () => {
        Location.getCurrentPositionAsync.mockResolvedValue({
            coords: { latitude: -34.6, longitude: -58.4, accuracy: 12 },
        });

        await expect(getCurrentLocation()).resolves.toEqual({
            latitude: -34.6,
            longitude: -58.4,
            accuracy: 12,
        });
        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('falla con un código claro si el GPS está desactivado', async () => {
        Location.hasServicesEnabledAsync.mockResolvedValue(false);

        await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'LOCATION_DISABLED' });
        expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    });

    it('no solicita ubicación cuando se deniega el permiso', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

        await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'LOCATION_PERMISSION_DENIED' });
        expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it('devuelve la suscripción de seguimiento para poder liberarla', async () => {
        const subscription = { remove: jest.fn() };
        Location.watchPositionAsync.mockResolvedValue(subscription);
        const callback = jest.fn();

        await expect(watchLocation(callback)).resolves.toBe(subscription);
        expect(Location.watchPositionAsync).toHaveBeenCalledTimes(1);
    });
});
