import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme_context';

export default function NoteBox({ note }) {
    const { currentTheme } = useTheme();

    const contentBlocks = JSON.parse(note.content);
    const savedTheme = note.theme

    return (
        <View style={[styles.container, { backgroundColor: savedTheme?.containerBg ?? currentTheme.containerBg }]}>
            <Text style={[styles.title, { color: savedTheme?.titleColor ?? currentTheme.titleColor }]}>
                {note.title}
            </Text>
            <Text style={[styles.text, { color: savedTheme?.secondaryColor ?? currentTheme.secondaryColor }]}>
                {contentBlocks.length > 0 ? contentBlocks[0].content : ''}
            </Text>
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
        fontSize: 14,
    }
});
