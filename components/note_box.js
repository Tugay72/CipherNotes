import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';

export default function NoteBox({ note }) {
    const { currentTheme } = useTheme();

    const savedTheme = note.theme;
    const isEncrypted = note.notePassword && note.notePassword.length > 0;

    const getEncryptedContent = () => {
        try {
            const contentBlocks = JSON.parse(note.content);
            const content = Array.isArray(contentBlocks) && contentBlocks.length > 0 ? contentBlocks[0].content : '';
            const secretKey = CryptoJS.enc.Utf8.parse('1234567890123456');
            const iv = CryptoJS.enc.Utf8.parse('6543210987654321');
            
            const encrypted = CryptoJS.AES.encrypt(
                content,
                secretKey,
                { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
            ).toString();
            
            return encrypted;
        } catch (e) {
            return '';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {note.title}
            </Text>
            {isEncrypted ? (
                <View style={styles.encryptedContent}>
                    <MaterialCommunityIcons name="lock" size={24} color={savedTheme?.secondaryColor ?? currentTheme.secondaryColor} />
                    <Text style={[styles.encryptedText, { color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor }]}>
                        {getEncryptedContent()}
                    </Text>
                </View>
            ) : (
                <Text style={[styles.text, { color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor }]}>
                    {(() => {
                        try {
                            const contentBlocks = JSON.parse(note.content);
                            return Array.isArray(contentBlocks) && contentBlocks.length > 0 ? contentBlocks[0].content : '';
                        } catch (e) {
                            return '';
                        }
                    })()}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 172,
        height: 172,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    text: {
        maxHeight: 80,
        fontSize: 14,
    },

    encryptedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },

    encryptedText: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'monospace',
    }
});
