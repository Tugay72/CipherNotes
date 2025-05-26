import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Vibration, ImageBackground } from 'react-native';

import Home from './pages/home/home';
import CreateNote from './pages/note/create_note';
import ToDoComponent from './pages/to_do/to-do';
import Reminder from './pages/reminder/reminder';
import Settings from './pages/settings/settings';
import PasswordModal from './pages/home/password_modal';
import SetPasswordModal from './pages/home/set_first_password';

import { ThemeProvider } from './theme_context';
import EncryptedText from './pages/home/encrypted_text_animation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { passwordExists, verifyPassword } from './storage';  // Tek import

const Stack = createStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [storedPassword, setStoredPassword] = useState(null); // Şifre var mı kontrolü için
    const [isLoading, setIsLoading] = useState(true);
    const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);

    useEffect(() => {
        const checkIfPasswordSet = async () => {
            const password = await passwordExists();
            setStoredPassword(password);
            setIsLoading(false);
        };
        checkIfPasswordSet();
    }, []);

    const handlePasswordConfirm = async (enteredPassword) => {
        // Eğer şifre henüz belirlenmemişse doğrudan onayla
        if (storedPassword === false) {
            setIsAuthenticated(true);
            return true;
        }

        // Şifre varsa doğrulama yap
        const isValid = await verifyPassword(enteredPassword);
        if (isValid) {
            setIsAuthenticated(true);
            return true;
        }

        Vibration.vibrate(200);
        return false;
    };

    const handleSetPassword = () => {
        setShowSetPasswordModal(true);
    };

    const handlePasswordSetSuccess = () => {
        setShowSetPasswordModal(false);
        setIsAuthenticated(true);
    };

    const onConfirmPassword = async (enteredPassword) => {
        return await handlePasswordConfirm(enteredPassword);
    };

    if (isLoading) {
        // İstersen burada bir loading spinner da koyabilirsin
        return null;
    }

    if (!isAuthenticated) {
        return (
            <ThemeProvider>
                <ImageBackground
                    source={require('./assets/enter_password_bg.jpg')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />

                    <View style={styles.container}>
                        <View style={styles.floatingText}>
                            <MaterialCommunityIcons
                                name="lock"
                                size={24}
                                color="#fff"
                                style={{ paddingLeft: 120 }}
                            />
                            <EncryptedText text="Unbreakable password" />
                        </View>

                        <View style={{
                            position: 'absolute',
                            top: 320,
                            width: '100%',
                        }}>
                            <PasswordModal
                                onConfirm={onConfirmPassword}
                                onSetPassword={handleSetPassword}
                                isPasswordSet={storedPassword !== false}
                            />
                        </View>

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
                    <Stack.Screen name="CreateReminder" component={Reminder} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingText: {
        position: 'absolute',
        flexDirection: 'column',
        top: 280,
        alignSelf: 'center',
        justifyContent: 'center',
    },
});
