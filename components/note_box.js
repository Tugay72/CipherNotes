import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NoteBox({ note, encryptedData }) {
    const { currentTheme } = useTheme();

    let contentBlocks = [];
    try {
        contentBlocks = JSON.parse(note.content);
    } catch (e) {
        console.warn('Failed to parse note content JSON:', e);
    }

    const savedTheme = note.theme;

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {note.title}
            </Text>

            {encryptedData
                ? (
                    <View style={styles.encryptedTextBox}>
                        <MaterialCommunityIcons name="lock" size={24} color={currentTheme.secondaryColor} />
                        <Text style={[
                            styles.text,
                            {
                                color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor,
                                marginTop: 12
                            }
                        ]}>
                            Şifrelenmiş Not
                        </Text>
                    </View>

                )
                : (
                    <Text style={[
                        styles.text,
                        {
                            color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor
                        }
                    ]}>
                        {Array.isArray(contentBlocks) && contentBlocks.length > 0 ? contentBlocks[0].content : ''}
                    </Text>
                )
            }


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
    encryptedTextBox: {
        height: '60%',
        width: '100%',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
