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
        padding: 20,
    },
    container: {
        backgroundColor: '#121212',
        padding: 28,
        borderRadius: 24,
        width: '100%',
        maxWidth: 380,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#1e1e1e',
        color: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2e2e2e',
        marginBottom: 16,
        fontSize: 16,
    },
    error: {
        color: '#FF4C4C',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 14,
    },
    button: {
        backgroundColor: '#00C851',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#00C851',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.4,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    cancelText: {
        color: '#999',
        fontSize: 15,
    },
});


