import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme_context'; // tema context'i kullanalım

export default function ChangePasswordModal({ visible, onClose }) {
    const { currentTheme } = useTheme();

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
            onClose(); // Modal kapat
        } catch (e) {
            Alert.alert('Hata', 'Şifre güncellenemedi.');
        }
    };

    const styles = getStyles(currentTheme);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.topNavContainer}>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.buttonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>Change Password</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Current Password"
                            placeholderTextColor={currentTheme.lowerOpacityText}
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            placeholderTextColor={currentTheme.lowerOpacityText}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            autoCapitalize="none"
                        />

                        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                            <Text style={styles.buttonLabel}>Update Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = (theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: theme.containerBg,
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    topNavContainer: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: theme.secondaryColor,
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.secondaryColor,
        marginBottom: 16,
    },
    input: {
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.secondaryColor + '44', // hafif transparan border
    },
    button: {
        backgroundColor: theme.secondaryColor,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonLabel: {
        color: theme.primaryColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
