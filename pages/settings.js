import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

import theme from '../theme';

export default function Settings({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        loadPassword();
    }, []);

    const loadPassword = async () => {
        try {
            const storedPassword = await AsyncStorage.getItem('appPassword');
            if (storedPassword) {
                setCurrentPassword(storedPassword);
            } else {
                // Varsayılan şifre ayarla
                await AsyncStorage.setItem('appPassword', '1234');
                setCurrentPassword('1234');
            }
        } catch (e) {
            console.error('Failed to load password:', e);
        }
    };

    const handleChangePassword = async () => {
        if (oldPassword !== currentPassword) {
            Alert.alert('Hatalı şifre', 'Mevcut şifrenizi yanlış girdiniz.');
            return;
        }

        if (newPassword.length < 4) {
            Alert.alert('Geçersiz şifre', 'Yeni şifre en az 4 karakter olmalı.');
            return;
        }

        try {
            await AsyncStorage.setItem('appPassword', newPassword);
            setCurrentPassword(newPassword);
            setOldPassword('');
            setNewPassword('');
            Alert.alert('Başarılı', 'Şifreniz değiştirildi.');
        } catch (e) {
            Alert.alert('Hata', 'Şifre güncellenemedi.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topNavContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>☚</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.text}>Change Password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#777"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />

                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#777"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonLabel}>Update Password</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" hidden={false} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingTop: 16,
        flex: 1,
    },
    topNavContainer: {
        width: '100%',
        height: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'black',
    },
    content: {
        flex: 1,
        marginTop: 48,
        padding: 16,
        gap: 16,
    },
    text: {
        fontSize: 18,
        color: theme.secondaryColor,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonText: {
        color: theme.secondaryColor,
        fontSize: 32,
        fontWeight: 'bold',
    },
});
