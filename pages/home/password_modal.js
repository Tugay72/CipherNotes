import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

export default function PasswordModal({ visible, onClose, onConfirm, onSetPassword, isPasswordSet }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        const success = await onConfirm?.(password);
        if (!success) {
            setError('⚠️ Hatalı şifre. Lütfen tekrar deneyin.');
        } else {
            setError('');
            setPassword('');
            onClose?.();
        }
    };

    const handleQuickLogin = async () => {
        const success = await onConfirm?.('');
        if (success) {
            setPassword('');
            setError('');
            onClose?.();
        } else {
            setError('⚠️ Hatalı giriş.');
        }
    };

    const handleSetPassword = () => {
        onSetPassword?.();
        setPassword('');
        setError('');
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

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
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        padding: 24,
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
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
    errorText: {
        color: '#FF4C4C',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 14,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 14,
    },
    confirmButton: {
        backgroundColor: '#00B0FF',
        shadowColor: '#00B0FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: '#333',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.4,
    },
});
