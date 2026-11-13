import * as Location from 'expo-location';

const deviceError = (code, cause) => {
    const error = new Error(code);
    error.code = code;
    if (cause) error.cause = cause;
    return error;
};

const ensureLocationAccess = async () => {
    let servicesEnabled;

    try {
        servicesEnabled = await Location.hasServicesEnabledAsync();
    } catch (error) {
        throw deviceError('LOCATION_STATUS_UNAVAILABLE', error);
    }

    if (!servicesEnabled) throw deviceError('LOCATION_DISABLED');

    let permission;
    try {
        permission = await Location.requestForegroundPermissionsAsync();
    } catch (error) {
        throw deviceError('LOCATION_PERMISSION_UNAVAILABLE', error);
    }

    if (permission.status !== 'granted') throw deviceError('LOCATION_PERMISSION_DENIED');
};

export const getCurrentLocation = async () => {
    await ensureLocationAccess();

    let position;
    try {
        position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
    } catch (error) {
        throw deviceError('LOCATION_UNAVAILABLE', error);
    }

    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
    };
};

export const watchLocation = async (onLocationUpdate, options = {}) => {
    if (typeof onLocationUpdate !== 'function') {
        throw deviceError('LOCATION_CALLBACK_REQUIRED');
    }

    await ensureLocationAccess();

    try {
        return await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 10,
                ...options,
            },
            (position) => {
                if (position?.coords) onLocationUpdate(position.coords);
            }
        );
    } catch (error) {
        throw deviceError('LOCATION_WATCH_FAILED', error);
    }
};

export const watchPosition = watchLocation;
