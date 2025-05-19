import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function CreatePasswordModal({ visible, onClose, onSave, theme }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={[
                    styles.modalContainer,
                    { backgroundColor: theme.containerBg }
                ]}>
                    <Text style={[styles.title, { color: theme.secondaryColor }]}>Şifre Oluştur</Text>

                    <TextInput
                        placeholder="Şifre"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry={true}
                        style={[styles.input, {
                            backgroundColor: theme.buttonBg,
                            color: theme.secondaryColor,
                            borderColor: theme.secondaryColor + '44',
                        }]}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TextInput
                        placeholder="Şifreyi Tekrarla"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry={true}
                        style={[styles.input, {
                            backgroundColor: theme.buttonBg,
                            color: theme.secondaryColor,
                            borderColor: theme.secondaryColor + '44',
                        }]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    {error ? <Text style={[styles.errorText, { color: theme.errorColor }]}>{error}</Text> : null}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={[
                                styles.button,
                                { backgroundColor: theme.buttonBg, borderWidth: 1, borderColor: theme.secondaryColor }
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: theme.secondaryColor }]}>İptal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSave}
                            style={[
                                styles.button,
                                { backgroundColor: theme.primaryColor }
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
    },
    modalContainer: {
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    errorText: {
        marginBottom: 12,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});
