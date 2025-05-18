import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Vibration, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './pages/home';
import CreateNote from './pages/create_note';
import ToDoComponent from './components/to-do';
import Settings from './pages/settings';
import PasswordModal from './components/password_modal';
import SetPasswordModal from './components/set_first_password';

const Stack = createStackNavigator();

import { ThemeProvider } from './theme_context';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [storedPassword, setStoredPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);


    useEffect(() => {
        const getStoredPassword = async () => {
            const password = await AsyncStorage.getItem('appPassword');
            setStoredPassword(password);
            if (password === null) {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };
        getStoredPassword();
    }, []);

    const handlePasswordConfirm = (enteredPassword) => {
        if (storedPassword === null) {
            setIsAuthenticated(true);
            return true;
        }

        if (enteredPassword === storedPassword) {
            setIsAuthenticated(true);
            return true;
        }

        Vibration.vibrate(200);
        return false;
    };

    const handleSetPassword = () => {
        setShowSetPasswordModal(true);
    };

    // Şifre başarıyla ayarlandığında:
    const handlePasswordSetSuccess = () => {
        setShowSetPasswordModal(false);
        setIsAuthenticated(true);
    };

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <ThemeProvider>
                <ImageBackground
                    source={require('./assets/enter_password_bg.jpg')}
                    style={styles.background}
                    resizeMode='cover'
                >
                    <View style={styles.container}>
                        <PasswordModal
                            visible={true}
                            onClose={() => { }}
                            onConfirm={handlePasswordConfirm}
                            onSetPassword={handleSetPassword}
                            isPasswordSet={storedPassword !== null}
                        />

                        <SetPasswordModal
                            visible={showSetPasswordModal}
                            onClose={() => setShowSetPasswordModal(false)}
                            onSuccess={handlePasswordSetSuccess}
                        />

                    </View>
                </ImageBackground>

            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="CreateNote" component={CreateNote} />
                    <Stack.Screen name="CreateToDo" component={ToDoComponent} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }
});
