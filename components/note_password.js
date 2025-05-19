import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PasswordModal({
    visible,
    onClose,
    onUnlock,
    notePassword,
    theme,
}) {
    const [inputPassword, setInputPassword] = useState('');

    const handleUnlock = () => {
        if (inputPassword === notePassword) {
            setInputPassword('');
            onUnlock();
        } else {
            Alert.alert('Hatalı Şifre', 'Lütfen doğru şifreyi giriniz.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: theme.primaryColor }]}>
                <View style={[styles.modalContainer, { backgroundColor: theme.containerBg }]}>
                    <Text style={[styles.title, { color: theme.secondaryColor }]}>Notu Görmek İçin Şifre Girin</Text>
                    <TextInput
                        value={inputPassword}
                        onChangeText={setInputPassword}
                        placeholder="Şifre"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry={true}
                        style={[
                            styles.input,
                            {
                                borderColor: theme.secondaryColor + '44',
                                color: theme.secondaryColor,
                                backgroundColor: theme.buttonBg,
                            },
                        ]}
                        autoFocus
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.lowerOpacityText }]}
                            onPress={handleUnlock}
                        >
                            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Gir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.buttonBg }]}
                            onPress={() => {
                                setInputPassword('');
                                onClose();
                            }}
                        >
                            <Text style={[styles.buttonText, { color: theme.secondaryColor }]}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        padding: 24,
        borderRadius: 12,
        width: '85%',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    buttonText: {
        fontWeight: 'bold',
    },
});
