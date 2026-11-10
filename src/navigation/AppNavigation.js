import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoadingState from '../components/LoadingState';
import { AuthContext } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function AppNavigator() {
    const authContext = useContext(AuthContext);
    const user = authContext?.user || null;
    const checkingSession = Boolean(authContext?.checkingSession);

    if (checkingSession) {
        return <LoadingState message="Verificando sesión de UrbanAlert..." />;
    }

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
