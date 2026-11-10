import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export const AUTH_ROUTES = {
    LOGIN: 'Login',
    REGISTRO: 'Registro',
};

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName={AUTH_ROUTES.LOGIN}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={AUTH_ROUTES.REGISTRO} component={RegisterScreen} />
        </Stack.Navigator>
    );
}
