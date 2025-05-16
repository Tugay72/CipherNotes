import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetPasswordModal({ visible, onClose, onSuccess }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSetPassword = async () => {
        if (!password || !confirmPassword) {
            setError('⚠️ Lütfen tüm alanları doldurun.');
            return;
        }

        if (password !== confirmPassword) {
            setError('⚠️ Şifreler uyuşmuyor.');
            return;
        }

        await AsyncStorage.setItem('appPassword', password);
        setPassword('');
        setConfirmPassword('');
        setError('');
        onSuccess(); // Girişe izin ver
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Şifre Belirle</Text>
                    <TextInput
                        placeholder="Yeni Şifre"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        placeholder="Şifreyi Tekrarla"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleSetPassword}>
                        <Text style={styles.buttonText}>Şifreyi Kaydet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Vazgeç</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 12,
        width: '90%',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    error: {
        color: '#ff4d4d',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
    },
    cancelText: {
        color: '#ccc',
    },
});
