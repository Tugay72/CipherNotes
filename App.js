import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './pages/home';
import CreateNote from './pages/create_note';
import Settings from './pages/settings';
import PasswordModal from './components/password_modal';

const Stack = createStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [storedPassword, setStoredPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getStoredPassword = async () => {
            const password = await AsyncStorage.getItem('appPassword');
            setStoredPassword(password);

            if (password === null) {
                setIsAuthenticated(true);
            }

            setIsLoading(false);
        };

        getStoredPassword();
    }, []);


    const handlePasswordConfirm = (enteredPassword) => {
        if (enteredPassword === storedPassword) {
            setIsAuthenticated(true);
            return true;
        }
        Vibration.vibrate(200);
        return false;
    };


    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <PasswordModal
                    visible={true}
                    onClose={() => { }}
                    onConfirm={handlePasswordConfirm}
                />
            </View>
        );
    }



    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="CreateNote" component={CreateNote} />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
