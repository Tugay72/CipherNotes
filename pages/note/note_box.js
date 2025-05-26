import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme_context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NoteBox({ note }) {
    const { currentTheme } = useTheme();

    const savedTheme = note.theme;
    const isEncrypted = note.notePassword && note.notePassword.length > 0;

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {note.title}
            </Text>
            {isEncrypted ? (
                <View style={styles.encryptedContent}>
                    <MaterialCommunityIcons name="lock" size={24} color={savedTheme?.secondaryColor ?? currentTheme.secondaryColor} />
                    <Text style={[styles.encryptedText, { color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor }]}>
                        Şifrelenmiş Not
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
        fontSize: 16,
        textAlign: 'center',
    }
});