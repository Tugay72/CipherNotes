import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme_context';
import { savePassword, verifyPassword } from '../../storage';

export default function ChangePasswordModal({ visible, onClose }) {
    const { currentTheme } = useTheme();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        const verify = await verifyPassword(oldPassword);
        if (!verify) {
            Alert.alert('Uncorrect password', 'You entered wrong password!');
            return;
        }

        if (newPassword.length === 0) {
            await savePassword(null);
            setOldPassword('');
            setNewPassword('');
            Alert.alert('Success', 'Your password has been changed!');
            onClose();
            return;
        }

        try {
            await savePassword(newPassword);
            setOldPassword('');
            setNewPassword('');
            Alert.alert('Success', 'Your password has been changed!');
            onClose();
        } catch (e) {
            Alert.alert('Error', 'Error while changing password');
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
                        <Text style={styles.title}>Change Password</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.buttonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>

                        <Text style={{ color: '#ffffff50', marginBottom: 8, marginLeft: 4 }}>Şifreyi kaldırmak için yeni şifre girme!</Text>
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
        paddingVertical: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    topNavContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
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
    },
    input: {
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.secondaryColor + '44',
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
