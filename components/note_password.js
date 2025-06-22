import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PasswordModal({
    visible,
    onClose,
    onUnlock,
    notePassword,
    theme,
}) {
    const [inputPassword, setInputPassword] = useState('');
    const styles = useMemo(() => getStyles(theme), [theme]);

    const handleUnlock = () => {
        if (inputPassword === notePassword) {
            setInputPassword('');
            onUnlock();
        } else {
            Alert.alert('Uncorrect password', 'Please enter the correct password.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Enter password to see the note!</Text>

                    <TextInput
                        value={inputPassword}
                        onChangeText={setInputPassword}
                        placeholder="Şifre"
                        placeholderTextColor={theme.placeholderText}
                        secureTextEntry={true}
                        style={styles.input}
                        autoFocus
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setInputPassword('');
                                onClose();
                            }}
                        >
                            <Text style={styles.cancelText}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.enterButton}
                            onPress={handleUnlock}
                        >
                            <Text style={styles.enterText}>Go</Text>
                        </TouchableOpacity>


                    </View>
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
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    container: {
        padding: 24,
        borderRadius: 12,
        width: '85%',
        alignItems: 'center',
        backgroundColor: theme.containerBg,
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: 'bold',
        color: theme.secondaryColor,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        fontSize: 16,
        borderColor: theme.secondaryColor + '44',
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    enterButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: theme.lowerOpacityText,
    },
    cancelButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: theme.errorButtonBg,
    },
    enterText: {
        fontWeight: 'bold',
        color: theme.primaryColor,
    },
    cancelText: {
        fontWeight: 'bold',
        color: theme.textOnError,
    },
});
