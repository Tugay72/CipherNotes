import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { verifyPassword } from '../../storage'; // Şifre kontrol fonksiyonu

export default function CreatePasswordModal({ visible, onClose, onSave, theme }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const styles = useMemo(() => getStyles(theme), [theme]);

    const handleSave = () => {
        if (!password || !confirmPassword) {
            setError('Lütfen her iki alanı da doldurun.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }
        setError('');
        onSave(password);
        setPassword('');
        setConfirmPassword('');
        onClose();
    };

    const handleClose = () => {
        setError('');
        setPassword('');
        setConfirmPassword('');
        onClose();
    };

    const handleRemovePassword = () => {
        setError('');
        onSave(password);
        setPassword('');
        setConfirmPassword('');
        onClose();

    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create Password</Text>

                    <TextInput
                        placeholder="Enter password"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TextInput
                        placeholder="Re-enter password"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveText}>Save Password</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleRemovePassword} style={styles.removeButton}>
                        <Text style={styles.removeText}>Remove Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: theme.containerBg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: theme.secondaryColor,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
        borderColor: theme.secondaryColor + '44',
    },
    error: {
        marginBottom: 12,
        textAlign: 'center',
        color: theme.errorColor,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: theme.errorButtonBg,
    },
    cancelText: {
        color: theme.secondaryColor,
        fontWeight: '600',
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: theme.buttonBg,
    },
    saveText: {
        color: theme.buttonText,
        fontWeight: '600',
        fontSize: 16,
    },
    removeButton: {
        marginTop: 16,
        alignSelf: 'center',
    },
    removeText: {
        color: theme.errorColor,
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});
