import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

export default function PasswordModal({ visible, onClose, onConfirm, onSetPassword, isPasswordSet }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        const success = onConfirm?.(password);
        if (!success) {
            setError('⚠️ Hatalı şifre. Lütfen tekrar deneyin.');
        } else {
            setError('');
            setPassword('');
        }
    };

    const handleQuickLogin = () => {
        onConfirm?.('');
        setPassword('');
        setError('');
    };

    const handleSetPassword = () => {
        onSetPassword?.();
        setPassword('');
        setError('');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {isPasswordSet ? 'Şifreyi Gir' : 'Giriş Yap'}
                    </Text>

                    {isPasswordSet ? (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Şifre"
                                placeholderTextColor="#aaa"
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (error) setError('');
                                }}
                            />

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>Giriş Yap</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleQuickLogin}>
                                <Text style={styles.buttonText}>Giriş Yap</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSetPassword}>
                                <Text style={styles.buttonText}>Şifre Ayarla</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#1a1a1a80',
        padding: 24,
        borderRadius: 32,
        width: '90%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    errorText: {
        color: '#ff4d4d',
        marginBottom: 12,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: '#007bff',
    },
    secondaryButton: {
        backgroundColor: '#444',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
